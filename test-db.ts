
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        await prisma.$connect()
        console.log('Successfully connected to the database')
        const count = await prisma.product.count()
        console.log(`Found ${count} products`)
    } catch (e) {
        console.error('Connection failed:', e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
