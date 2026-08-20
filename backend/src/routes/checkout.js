const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const prisma = require("../prismaClient");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

function razorpayErrorMessage(err) {
  return err.error?.description || err.message || "Unknown Razorpay error.";
}

function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set in backend/.env yet.");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// items: [{ productId, quantity }]
router.post("/create-order", requireAuth, async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty." });
  }

  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  let orderItemsData;
  try {
    orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      return { productId: product.id, quantity: item.quantity, priceEach: product.price };
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const totalRupees = orderItemsData.reduce(
    (sum, item) => sum + item.priceEach * item.quantity,
    0
  );

  let razorpay;
  try {
    razorpay = getRazorpay();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalRupees * 100),
      currency: "INR",
      receipt: `receipt_${req.session.userId}_${Date.now()}`,
    });

    const order = await prisma.order.create({
      data: {
        userId: req.session.userId,
        status: "pending",
        razorpayOrderId: razorpayOrder.id,
        items: {
          create: orderItemsData.map(({ productId, quantity, priceEach }) => ({
            productId,
            quantity,
            priceEach,
          })),
        },
      },
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
    });
  } catch (err) {
    console.error("Razorpay create-order failed:", err);
    res.status(500).json({ error: razorpayErrorMessage(err) });
  }
});

router.post("/verify", requireAuth, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing payment verification fields." });
  }

  const order = await prisma.order.findUnique({
    where: { razorpayOrderId: razorpay_order_id },
  });

  if (!order || order.userId !== req.session.userId) {
    return res.status(404).json({ error: "Order not found." });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: "Payment verification failed." });
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status: "paid" },
  });

  res.json({ orderId: updated.id, status: updated.status });
});

module.exports = router;
