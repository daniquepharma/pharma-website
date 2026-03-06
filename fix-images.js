const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany();
  for (const p of products) {
     const newImages = p.images.map(img => {
         if (img.startsWith('/api/products/')) {
             return img.replace('/api/products/', '/api/uploads/products/');
         }
         return img;
     });
     if (p.images.toString() !== newImages.toString()) {
         await prisma.product.update({ where: { id: p.id }, data: { images: newImages }});
         console.log(`Fixed product DB entry: ${p.name}`);
     }
  }
  console.log("Images check complete.");
}
main();
