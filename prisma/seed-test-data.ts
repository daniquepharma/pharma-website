import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';

async function main() {
    console.log('Seeding Razorpay test data...');

    // 1. Create a Test Product
    const testProduct = await prisma.product.upsert({
        where: { id: "test-product-razorpay" }, // Assuming we can't reliably find by name, but we don't have a constant ID. Let's find first instead.
        update: {},
        create: {
            name: "Razorpay Test Product",
            description: "A very cheap product for Razorpay verification purposes",
            price: 1, // Minimum amount possible (₹1)
            stock: 1000,
            category: "Test",
            images: [],
        },
    });
    console.log(`Created test product: ${testProduct.name} with ID: ${testProduct.id}`);

    // 2. Create a Test User
    const hashedPassword = await bcrypt.hash("razorpaytest123", 10);
    const testUser = await prisma.user.upsert({
        where: { email: "razorpay@example.com" },
        update: {
            password: hashedPassword, // Reset password to ensure it's always this one if script is re-run
        },
        create: {
            name: "Razorpay Reviewer",
            email: "razorpay@example.com",
            password: hashedPassword,
            phone: "9999999999",
            emailVerified: new Date(),
        },
    });
    console.log(`Test user: ${testUser.name} with Email: ${testUser.email} (Password: razorpaytest123)`);

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
