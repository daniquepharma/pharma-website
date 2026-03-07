import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isCorrectPassword) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    businessName: user.businessName,
                    drugLicense: user.drugLicense,
                    gstNumber: user.gstNumber,
                    isVerified: user.isVerified,
                };
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user, account, trigger, session }) {
            // Update token if the session is updated manually
            if (trigger === "update" && session) {
                token.businessName = session.businessName;
                token.drugLicense = session.drugLicense;
                token.gstNumber = session.gstNumber;
                token.isVerified = session.isVerified;
            }

            if (user) {
                token.id = user.id;
                token.businessName = user.businessName;
                token.drugLicense = user.drugLicense;
                token.gstNumber = user.gstNumber;
                token.isVerified = user.isVerified;
            }

            // Handle Google OAuth - create user in DB if doesn't exist
            if (account?.provider === "google" && user) {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                });

                if (!existingUser) {
                    const newUser = await prisma.user.create({
                        data: {
                            email: user.email!,
                            name: user.name!,
                            image: user.image,
                            emailVerified: new Date(),
                        },
                    });
                    token.id = newUser.id;
                } else {
                    token.id = existingUser.id;
                    token.businessName = existingUser.businessName;
                    token.drugLicense = existingUser.drugLicense;
                    token.gstNumber = existingUser.gstNumber;
                    token.isVerified = existingUser.isVerified;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id as string;
                session.user.businessName = token.businessName as string | null | undefined;
                session.user.drugLicense = token.drugLicense as string | null | undefined;
                session.user.gstNumber = token.gstNumber as string | null | undefined;
                session.user.isVerified = token.isVerified as boolean;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
