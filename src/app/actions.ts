'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function getProducts() {
    return await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    })
}

export async function getProductById(id: string) {
    return await prisma.product.findUnique({
        where: { id }
    })
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
