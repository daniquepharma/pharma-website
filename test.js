const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany({ take: 1 });
  if (products.length > 0) {
    console.log(products[0].id);
  }
}
main();
