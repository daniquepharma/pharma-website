
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const products = [
        {
            name: "SLATY-OD",
            category: "Tablet/Capsule",
            description: "Advanced formulation for daily health.",
            price: 15.99,
            stock: 100,
            images: ["https://placehold.co/600x400?text=SLATY-OD"]
        },
        {
            name: "WELLAROZ FORTE",
            category: "Supplement",
            description: "High potency nutritional support.",
            price: 24.99,
            stock: 50,
            images: ["https://placehold.co/600x400?text=WELLAROZ+FORTE"]
        },
        {
            name: "DANIQUE D3 60K",
            category: "Vitamin D3",
            description: "Essential bone health supplement.",
            price: 12.50,
            stock: 200,
            images: ["https://placehold.co/600x400?text=DANIQUE+D3"]
        },
        {
            name: "PENTRYP-NT",
            category: "Pain Relief",
            description: "Effective relief for neuropathic pain.",
            price: 18.75,
            stock: 75,
            images: ["https://placehold.co/600x400?text=PENTRYP-NT"]
        },
    ]

    for (const p of products) {
        await prisma.product.create({
            data: p,
        })
    }

    console.log('Seeded database with initial products')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
