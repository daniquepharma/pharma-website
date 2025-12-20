'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { writeFile, readdir } from 'fs/promises'
import { join } from 'path'

export async function getProducts() {
    return await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    })
}

export async function getProductById(id: string) {
    // Check if it's a UUID (database product)
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        return await prisma.product.findUnique({
            where: { id }
        })
    }

    // Fallback to local file lookup
    return await getLocalProductById(id);
}

async function getLocalProductById(slug: string) {
    try {
        const productsDirectory = join(process.cwd(), "public/Medicine");
        const filenames = await readdir(productsDirectory);

        // Find file matching the slug
        const file = filenames.find(f => {
            const name = f.replace(/\.[^/.]+$/, "").replace(/-/g, " ");
            const s = name.toLowerCase().replace(/\s+/g, '-');
            return s === slug;
        });

        if (!file) return null;

        const name = file.replace(/\.[^/.]+$/, "").replace(/-/g, " ");
        let description = `${name} - High quality pharmaceutical product suitable for various treatments.`;
        let price = 29.99;
        let category = "General Medicine";

        // Custom details for Wellaroz Forte
        if (slug === 'wellaroz-forte') {
            description = `**Wellaroz Forte Capsules** are used primarily for promoting joint health, especially for conditions like osteoarthritis and arthralgia (joint pain). It is a nutritional supplement that helps to reduce pain, stiffness, and inflammation in the joints.\n\n### How it works\nThe benefits of Wellaroz Forte come from its key ingredients, which work together to support joint health:\n\n* **Collagen Peptide:** A building block of cartilage and connective tissues. It helps repair joint damage, reduces pain and swelling, and improves joint mobility.\n* **Sodium Hyaluronate:** A lubricating substance that reduces friction within the joints, allowing for smoother, easier movement.\n* **Rose Hip Extract:** A rich source of antioxidants and anti-inflammatory compounds that help ease joint pain and inflammation.\n\n### Therapeutic uses\nIn addition to general joint support, it is used to aid recovery in various musculoskeletal conditions:\n* Osteoarthritis\n* Rheumatoid arthritis\n* Osteoporosis and osteopenia\n* Injured ligaments and tendons\n* Kneecap problems\n* Stiffness and pain from joint wear and tear\n\n### How to take Wellaroz Forte\n* Take the capsule as directed by a physician.\n* It is generally recommended to take it with food to avoid stomach upset.\n* Do not crush or chew the capsule; swallow it whole.`;
            category = "Joint Health";
            price = 45.00;
        }

        return {
            id: slug,
            name: name,
            description: description,
            price: price,
            stock: 100,
            category: category,
            images: [`/Medicine/${file}`],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    } catch (error) {
        console.error("Error looking up local product:", error);
        return null;
    }
}

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const category = formData.get('category') as string

    // Handle File Upload
    const file = formData.get('productImage') as File
    let imagePath = ''

    if (file && file.size > 0 && file.name !== 'undefined') {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
        const path = join(process.cwd(), 'public/uploads', filename)

        await writeFile(path, buffer)
        imagePath = `/uploads/${filename}`
    }

    const images = imagePath ? [imagePath] : []

    await prisma.product.create({
        data: {
            name,
            description,
            price,
            stock,
            category,
            images
        }
    })

    revalidatePath('/products')
    revalidatePath('/admin')
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id }
    })
    revalidatePath('/products')
    revalidatePath('/admin')
}

export async function createOrder(data: {
    customerName: string;
    customerEmail: string;
    address: string;
    items: { productId: string; quantity: number; price: number }[];
    total: number;
}) {
    const order = await prisma.order.create({
        data: {
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            address: data.address,
            total: data.total,
            items: {
                create: data.items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }))
            }
        }
    });

    // Optional: Update stock
    for (const item of data.items) {
        await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
        });
    }

    return { success: true, orderId: order.id };
}

export async function getAllOrders() {
    return await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } }
    });
}

export async function updateOrderStatus(orderId: string, status: string) {
    await prisma.order.update({
        where: { id: orderId },
        data: { status }
    });
    revalidatePath('/admin/orders');
    revalidatePath(`/track`);
}

export async function getOrderById(orderId: string) {
    // Basic validation to prevent Prisma error on invalid UUID format if user types random text
    // Prisma UUID validation is strict.
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)) {
        return null;
    }

    return await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } } }
    });
}
