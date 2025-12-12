import type { Metadata } from "next";
import { Roboto, Lato } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const lato = Lato({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Danique Formulations | Healing Hands, Caring Hearts",
  description: "At the forefront of science and compassion, transforming lives through innovative healthcare.",
};

import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${lato.variable} antialiased bg-slate-950 text-slate-200`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
