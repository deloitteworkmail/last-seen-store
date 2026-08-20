const express = require("express");
const prisma = require("../prismaClient");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.session.userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  res.json(orders);
});

router.get("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order || order.userId !== req.session.userId) {
    return res.status(404).json({ error: "Order not found." });
  }

  res.json(order);
});

module.exports = router;
