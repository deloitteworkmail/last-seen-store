const prisma = require("../prismaClient");

async function requireAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "You must be logged in." });
  }

  const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: "Admin access required." });
  }

  next();
}

module.exports = requireAdmin;
