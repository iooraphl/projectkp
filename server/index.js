import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { verifyToken, verifyAdmin } from "./middleware/auth.js";
import { register, login, getProfile, updateProfile, changePassword } from "./routes/auth.js";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = Number(process.env.PORT || 4000);
const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
const webOrigins = new Set(
  (process.env.WEB_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

webOrigins.add("http://127.0.0.1:5173");

const manualBankInfo = {
  bank: process.env.MANUAL_BANK_NAME || "BCA",
  accountNumber: process.env.MANUAL_BANK_ACCOUNT_NUMBER || "1234567890",
  accountName: process.env.MANUAL_BANK_ACCOUNT_NAME || "PT Surya Ban Nusantara"
};

const supportedPayments = new Set(["TRANSFER_BANK", "COD"]);
const supportedStatuses = new Set([
  "UNPAID",
  "COD",
  "WAITING_CONFIRMATION",
  "PAID",
  "CANCELLED"
]);

fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${extension}`);
    }
  }),
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (_, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("File harus berupa gambar"));
      return;
    }

    callback(null, true);
  }
});

const productFields = [
  "name",
  "brand",
  "category",
  "description",
  "price",
  "size",
  "width",
  "profile",
  "rim",
  "loadIndex",
  "speedRating",
  "vehicleType",
  "compatibleCars",
  "character",
  "condition",
  "yearProduction",
  "warranty",
  "image",
  "stock",
  "badge",
  "note"
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || webOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

const normalizeProductInput = (body) => {
  const data = {};

  for (const field of productFields) {
    if (Object.hasOwn(body, field)) {
      data[field] = typeof body[field] === "string" ? body[field].trim() : body[field];
    }
  }

  if (Object.hasOwn(data, "price")) {
    data.price = Number(data.price);
  }

  for (const field of productFields) {
    if (field !== "price" && data[field] === "") {
      data[field] = null;
    }
  }

  return data;
};

const validateProductInput = (data, partial = false) => {
  const requiredFields = ["name", "brand", "category", "price"];

  if (!partial) {
    for (const field of requiredFields) {
      if (!data[field]) {
        return `${field} wajib diisi`;
      }
    }
  }

  if (Object.hasOwn(data, "price") && (!Number.isFinite(data.price) || data.price <= 0)) {
    return "Harga produk tidak valid";
  }

  return null;
};

const removeUploadedImage = (image) => {
  if (!image?.startsWith("/uploads/products/")) return;

  const filePath = path.join(process.cwd(), "public", image);

  if (!filePath.startsWith(uploadDir)) return;

  fs.rm(filePath, { force: true }, () => {});
};

const buildMethodLabel = (paymentMethod) =>
  paymentMethod === "TRANSFER_BANK" ? "Transfer Manual" : "COD";

const createOrderId = () =>
  `SB-MANUAL-${Date.now()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

const createRefCode = () =>
  `REF-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

// ============================================
// HEALTH CHECK
// ============================================
app.get("/api/health", (_, res) => {
  res.json({
    ok: true,
    provider: "manual",
    storage: "postgresql"
  });
});

// ============================================
// PRODUCT ROUTES
// ============================================
app.get("/api/products", async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const category = String(req.query.category || "").trim();
    const rim = String(req.query.rim || "").trim();

    const products = await prisma.product.findMany({
      where: {
        ...(category && category !== "Semua" ? { category } : {}),
        ...(rim && rim !== "Semua Ring" ? { rim } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { brand: { contains: search, mode: "insensitive" } },
                { size: { contains: search, mode: "insensitive" } },
                { category: { contains: search, mode: "insensitive" } },
                { compatibleCars: { contains: search, mode: "insensitive" } },
                { character: { contains: search, mode: "insensitive" } }
              ]
            }
          : {})
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ count: products.length, products });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

app.post("/api/admin/products", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const data = normalizeProductInput(req.body || {});
    const validationError = validateProductInput(data);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const product = await prisma.product.create({ data });
    return res.status(201).json(product);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Nama produk sudah digunakan" });
    }

    return res.status(500).json({ message: error.message || "Internal server error" });
  }
});

app.put("/api/admin/products/:productId", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const data = normalizeProductInput(req.body || {});
    const validationError = validateProductInput(data, true);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const product = await prisma.product.update({
      where: { id: req.params.productId },
      data
    });

    return res.json(product);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    if (error.code === "P2002") {
      return res.status(409).json({ message: "Nama produk sudah digunakan" });
    }

    return res.status(500).json({ message: error.message || "Internal server error" });
  }
});

app.delete("/api/admin/products/:productId", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const product = await prisma.product.delete({
      where: { id: req.params.productId }
    });

    removeUploadedImage(product.image);

    return res.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    return res.status(500).json({ message: error.message || "Internal server error" });
  }
});

app.post(
  "/api/admin/products/:productId/image",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Gambar wajib dipilih" });
      }

      const existingProduct = await prisma.product.findUnique({
        where: { id: req.params.productId },
        select: { image: true }
      });

      if (!existingProduct) {
        removeUploadedImage(`/uploads/products/${req.file.filename}`);
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }

      const image = `/uploads/products/${req.file.filename}`;
      const product = await prisma.product.update({
        where: { id: req.params.productId },
        data: { image }
      });

      removeUploadedImage(existingProduct.image);

      return res.json(product);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }

      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  }
);

// ============================================
// AUTHENTICATION ROUTES
// ============================================
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.get("/api/auth/profile", verifyToken, getProfile);
app.put("/api/auth/profile", verifyToken, updateProfile);
app.put("/api/auth/change-password", verifyToken, changePassword);

// ============================================
// USER ROUTES (PROTECTED)
// ============================================
app.get("/api/users/:userId", verifyToken, async (req, res) => {
  try {
    // Users can only access their own profile unless admin
    if (req.user.userId !== Number(req.params.userId) && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.userId) },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

// Admin only: Get all users
app.get("/api/admin/users", verifyToken, verifyAdmin, async (_, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

// ============================================
// ORDER ROUTES
// ============================================
app.get("/api/orders", verifyToken, async (req, res) => {
  try {
    // Filter by user role
    const where = req.user.role === "ADMIN" ? {} : { userId: req.user.userId };

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true }
            }
          }
        }
      }
    });

    res.json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

app.get("/api/users/:userId/orders", verifyToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    // Users can only view their own orders unless admin
    if (req.user.userId !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true }
            }
          }
        }
      }
    });

    res.json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

app.post("/api/orders", verifyToken, async (req, res) => {
  try {
    const { cart, summary, paymentMethod } = req.body || {};
    const userId = req.user.userId;

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Keranjang kosong" });
    }

    if (!supportedPayments.has(paymentMethod)) {
      return res.status(400).json({ message: "Metode pembayaran tidak didukung" });
    }

    const amount = Math.round(Number(summary?.grandTotal || 0));
    if (amount <= 0) {
      return res.status(400).json({ message: "Nominal transaksi tidak valid" });
    }

    const orderId = createOrderId();
    const status = paymentMethod === "COD" ? "COD" : "UNPAID";

    const record = await prisma.order.create({
      data: {
        orderId,
        refCode: createRefCode(),
        userId,
        status,
        paymentMethod,
        methodLabel: buildMethodLabel(paymentMethod),
        amount,
        subtotal: Number(summary?.subtotal || 0),
        serviceFee: Number(summary?.serviceFee || 0),
        paymentFee: Number(summary?.paymentFee || 0),
        grandTotal: amount,
        bankInfo: paymentMethod === "TRANSFER_BANK" ? manualBankInfo : null,
        items: {
          create: cart.map((item) => ({
            productId: String(item.id),
            name: item.name,
            size: item.size || null,
            qty: Number(item.qty),
            price: Number(item.price)
          }))
        }
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true }
            }
          }
        }
      }
    });

    return res.json(record);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
});

app.get("/api/orders/:orderId", verifyToken, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderId: req.params.orderId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    // Users can only view their own orders unless admin
    if (req.user.userId !== order.userId && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
});

app.patch("/api/orders/:orderId/status", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const nextStatus = String(req.body?.status || "").toUpperCase();

    if (!supportedStatuses.has(nextStatus)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const order = await prisma.order.findUnique({
      where: { orderId: req.params.orderId }
    });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    const updatedOrder = await prisma.order.update({
      where: { orderId: req.params.orderId },
      data: {
        status: nextStatus,
        paidAt: nextStatus === "PAID" ? order.paidAt ?? new Date() : order.paidAt
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true }
            }
          }
        }
      }
    });

    return res.json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
});

// ============================================
// DATABASE CONNECTION & SERVER START
// ============================================
prisma
  .$connect()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Payment server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
  });
