'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { uploadFileToLocal, deleteFileFromLocal } from '@/lib/upload'
import { validateCredentials, createSession, deleteSession } from '@/lib/auth'
import { razorpay } from "@/lib/razorpay";

export async function getProducts(options?: {
    search?: string
    category?: string
    sort?: string
}) {
    const { search, category, sort } = options || {}

    const where: Prisma.ProductWhereInput = {}

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
        ]
    }

    if (category && category !== 'All') {
        where.category = { equals: category, mode: 'insensitive' }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }

    if (sort) {
        switch (sort) {
            case 'price_asc':
                orderBy = { price: 'asc' }
                break
            case 'price_desc':
                orderBy = { price: 'desc' }
                break
            case 'name_asc':
                orderBy = { name: 'asc' }
                break
            case 'name_desc':
                orderBy = { name: 'desc' }
                break
            case 'newest':
                orderBy = { createdAt: 'desc' }
                break
        }
    }

    return await prisma.product.findMany({
        where,
        orderBy
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

    // Handle Multiple File Upload
    const files = formData.getAll('productImage') as File[]
    const images: string[] = []

    for (const file of files) {
        if (file && file.size > 0 && file.name !== 'undefined') {
            try {
                const imageUrl = await uploadFileToLocal(file, "products");
                images.push(imageUrl);
            } catch (error) {
                console.error("Failed to upload image locally:", error);
                // Continue with other images or throw error based on preference
            }
        }
    }

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
    // Check if product has any active orders (not DELIVERED or CANCELLED)
    const activeOrderItems = await prisma.orderItem.findMany({
        where: {
            productId: id,
            order: {
                status: {
                    notIn: ['DELIVERED', 'CANCELLED']
                }
            }
        },
        include: {
            order: true
        }
    });

    if (activeOrderItems.length > 0) {
        const activeStatuses = activeOrderItems.map(item => item.order.status).join(', ');
        throw new Error(`Cannot delete product with active orders. This product has ${activeOrderItems.length} order(s) that are ${activeStatuses}. Please wait until orders are delivered or cancelled.`);
    }

    // Product can be deleted if all orders are DELIVERED or CANCELLED
    // Note: OrderItems are preserved for order history due to onDelete: Restrict in schema

    // 1. Get product to delete images
    const product = await prisma.product.findUnique({
        where: { id },
        select: { images: true }
    });

    // 2. Delete images locally (optimistic, don't block if fails)
    if (product?.images) {
        for (const imageUrl of product.images) {
            await deleteFileFromLocal(imageUrl);
        }
    }

    // 3. Delete product from DB
    await prisma.product.delete({
        where: { id }
    })
    revalidatePath('/products')
    revalidatePath('/admin')
}

export async function updateProduct(id: string, formData: FormData) {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const category = formData.get('category') as string

    // Handle Multiple File Upload (Append to existing)
    const files = formData.getAll('productImage') as File[]
    const newImages: string[] = []

    for (const file of files) {
        if (file && file.size > 0 && file.name !== 'undefined') {
            try {
                const imageUrl = await uploadFileToLocal(file, "products");
                newImages.push(imageUrl);
            } catch (error) {
                console.error("Failed to upload image locally:", error);
            }
        }
    }

    const updateData: Prisma.ProductUpdateInput = {
        name,
        description,
        price,
        stock,
        category
    }

    // Append new images to existing ones if any
    if (newImages.length > 0) {
        updateData.images = {
            push: newImages
        }
    }

    await prisma.product.update({
        where: { id },
        data: updateData
    })

    revalidatePath('/products')
    revalidatePath('/admin')
    revalidatePath(`/products/${id}`)
}

export async function deleteProductImage(productId: string, imageUrl: string) {
    const product = await prisma.product.findUnique({
        where: { id: productId }
    })

    if (product) {
        const updatedImages = product.images.filter(img => img !== imageUrl)

        // Delete locally
        await deleteFileFromLocal(imageUrl);

        await prisma.product.update({
            where: { id: productId },
            data: { images: updatedImages }
        })
        revalidatePath(`/admin/products/${productId}/edit`)
        revalidatePath(`/products/${productId}`)
    }
}

export async function createOrder(data: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    address: string;
    items: { productId: string; quantity: number; price: number }[];
    total: number;
}) {
    // Fetch product details to get stock  and names for order history
    const productIds = data.items.map(item => item.productId);
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, stock: true }
    });

    // Create a map for quick lookup
    const productMap = new Map(products.map(p => [p.id, { name: p.name, stock: p.stock }]));

    // Validate stock availability
    for (const item of data.items) {
        const product = productMap.get(item.productId);
        if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
        }
        if (product.stock <= 0) {
            throw new Error(`${product.name} is out of stock`);
        }
        if (item.quantity > product.stock) {
            throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock} available, but ${item.quantity} requested.`);
        }
    }

    const order = await prisma.order.create({
        data: {
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerPhone: data.customerPhone,
            address: data.address,
            total: data.total,
            items: {
                create: data.items.map(item => ({
                    productId: item.productId,
                    productName: productMap.get(item.productId)?.name || 'Unknown Product',
                    quantity: item.quantity,
                    price: item.price
                }))
            }
        }
    });

    // Update stock
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
    // 1. Fetch the existing order to check payment details
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { id: true, razorpayPaymentId: true, status: true }
    });

    if (!order) {
        throw new Error("Order not found");
    }

    // 2. Check if we need to process a refund
    // Only refund if moving TO Cancelled status AND it hasn't been cancelled already AND there is a payment ID
    if (status === "CANCELLED" && order.status !== "CANCELLED" && order.razorpayPaymentId) {
        try {
            console.log(`Initiating refund for Order ${orderId}, Payment ${order.razorpayPaymentId}`);

            // Call Razorpay Refund API
            const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
                notes: {
                    reason: "Order Cancelled by Admin",
                    orderId: order.id
                }
            });

            console.log(`Refund successful: ${refund.id}`);
        } catch (error) {
            console.error("Razorpay Refund Failed:", error);
            // Decide: Stop the cancellation if refund fails? Or allow cancellation but log error?
            // Safer to throw error so admin knows refund didn't happen.
            throw new Error(`Failed to process refund: ${(error as any).error?.description || (error as any).message}`);
        }
    }

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

// Authentication actions
export async function login(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const isValid = await validateCredentials(username, password);

    if (!isValid) {
        return { success: false, error: 'Invalid username or password' };
    }

    await createSession();
    redirect('/admin');
}

export async function logout() {
    await deleteSession();
    redirect('/admin/login');
}

