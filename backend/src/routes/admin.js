const express = require("express");
const prisma = require("../prismaClient");
const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/products", async (req, res) => {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { id: "asc" },
  });
  res.json(products);
});

router.post("/products", async (req, res) => {
  const { name, description, price, imageUrl, categoryId } = req.body;

  if (!name || !description || !price || !imageUrl || !categoryId) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      imageUrl,
      categoryId: Number(categoryId),
    },
  });

  res.status(201).json(product);
});

router.put("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, price, imageUrl, categoryId } = req.body;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price: Number(price) }),
      ...(imageUrl && { imageUrl }),
      ...(categoryId && { categoryId: Number(categoryId) }),
    },
  });

  res.json(product);
});

router.delete("/products/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.product.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: "Could not delete product (it may be referenced by existing orders)." });
  }
});

router.get("/categories", async (req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  res.json(categories);
});

router.post("/categories", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }

  try {
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: "A category with that name already exists." });
  }
});

router.get("/orders", async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      items: { include: { product: true } },
      user: { select: { email: true, region: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
});

module.exports = router;
