require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const categoriesRouter = require("./routes/categories");
const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const checkoutRouter = require("./routes/checkout");
const ordersRouter = require("./routes/orders");
const adminRouter = require("./routes/admin");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

// Needed so req.secure reflects the real client protocol when running
// behind Render's reverse proxy (which terminates TLS for us).
app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());
app.use(
  session({
    store: isProduction
      ? new pgSession({ conString: process.env.DATABASE_URL, createTableIfMissing: true })
      : undefined,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
