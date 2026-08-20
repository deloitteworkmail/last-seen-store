const express = require("express");
const prisma = require("../prismaClient");

const router = express.Router();

router.get("/", async (req, res) => {
  const { category } = req.query;

  const products = await prisma.product.findMany({
    where: category ? { category: { name: category } } : undefined,
    include: { category: true },
    orderBy: { id: "asc" },
  });

  res.json(products);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

module.exports = router;
