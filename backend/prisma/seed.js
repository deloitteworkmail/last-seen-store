const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const CATEGORIES = [
  {
    name: "Shirts",
    products: [
      { name: "Classic White Shirt", price: 899, description: "A crisp cotton button-up for everyday wear.", icon: "classic-white-shirt", ext: "jpg" },
      { name: "Denim Casual Shirt", price: 1299, description: "Relaxed-fit denim shirt, great for layering.", icon: "denim-casual-shirt", ext: "jpg" },
      { name: "Striped Linen Shirt", price: 1499, description: "Breathable linen shirt with a subtle stripe.", icon: "striped-linen-shirt", ext: "jpg" },
    ],
  },
  {
    name: "Jackets",
    products: [
      { name: "Bomber Jacket", price: 2999, description: "Lightweight bomber jacket with ribbed cuffs.", icon: "bomber-jacket" },
      { name: "Denim Jacket", price: 2599, description: "Timeless denim jacket, fits over any outfit.", icon: "denim-jacket", ext: "jpg" },
      { name: "Rain Shell", price: 2199, description: "Waterproof shell jacket for unpredictable weather.", icon: "rain-shell", ext: "jpg" },
    ],
  },
  {
    name: "Shoes",
    products: [
      { name: "Canvas Sneakers", price: 1799, description: "Everyday low-top canvas sneakers.", icon: "canvas-sneakers", ext: "jpg" },
      { name: "Leather Boots", price: 3499, description: "Durable leather boots built to last.", icon: "leather-boots", ext: "jpg" },
      { name: "Running Shoes", price: 2499, description: "Cushioned shoes designed for daily runs.", icon: "running-shoes", ext: "jpg" },
    ],
  },
  {
    name: "Accessories",
    products: [
      { name: "Leather Belt", price: 799, description: "Classic leather belt with a brushed buckle.", icon: "leather-belt", ext: "jpg" },
      { name: "Wool Beanie", price: 599, description: "Warm knit beanie for cold days.", icon: "wool-beanie", ext: "jpg" },
      { name: "Canvas Tote Bag", price: 999, description: "Sturdy tote bag for everyday carry.", icon: "canvas-tote-bag" },
    ],
  },
];

async function main() {
  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name },
    });

    for (let j = 0; j < cat.products.length; j++) {
      const p = cat.products[j];
      const productData = {
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: `/products/${p.icon}.${p.ext || "svg"}`,
        categoryId: category.id,
      };
      await prisma.product.upsert({
        where: { id: category.id * 100 + j },
        update: productData,
        create: { id: category.id * 100 + j, ...productData },
      });
    }
  }
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
