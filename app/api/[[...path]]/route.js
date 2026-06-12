import crypto from "node:crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma.js";
import { generateToken, getUserFromRequest } from "../../../lib/auth.js";
import { deleteCloudinaryImage, uploadImageBuffer } from "../../../lib/cloudinary.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const manualBankInfo = {
  bank: process.env.MANUAL_BANK_NAME || "BCA",
  accountNumber: process.env.MANUAL_BANK_ACCOUNT_NUMBER || "1234567890",
  accountName: process.env.MANUAL_BANK_ACCOUNT_NAME || "PT Surya Ban Nusantara"
};

const supportedPayments = new Set(["TRANSFER_BANK", "COD"]);
const supportedStatuses = new Set(["UNPAID", "COD", "WAITING_CONFIRMATION", "PAID", "CANCELLED"]);
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

const json = (data, init = {}) => NextResponse.json(data, init);

const getPathParts = (req) =>
  new URL(req.url).pathname.split("/").filter(Boolean).slice(1);

const readJsonBody = async (req) => {
  try {
    return await req.json();
  } catch {
    return {};
  }
};

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

const buildUniqueConstraintMessage = (error, fallback) => {
  const field = Array.isArray(error?.meta?.target) ? error.meta.target[0] : null;

  if (field === "name") {
    return "Nama produk sudah digunakan";
  }

  return fallback;
};

const buildMethodLabel = (paymentMethod) =>
  paymentMethod === "TRANSFER_BANK" ? "Transfer Manual" : "COD";

const createOrderId = () =>
  `SB-MANUAL-${Date.now()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

const createRefCode = () =>
  `REF-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

const getAuthUser = (req) => {
  const auth = getUserFromRequest(req);

  if (auth.error) {
    return auth;
  }

  return { user: auth.user };
};

const requireAdmin = (user) => {
  if (user?.role !== "ADMIN") {
    return { error: { status: 403, message: "Akses hanya untuk admin" } };
  }

  return { user };
};

const parseNumericId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const buildOrderInclude = {
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
};

export async function GET(req) {
  const [scope, resource, ...rest] = getPathParts(req);

  if (scope === "health") {
    return json({ ok: true, provider: "manual", storage: "postgresql" });
  }

  if (scope === "products") {
    try {
      const searchParams = new URL(req.url).searchParams;
      const search = String(searchParams.get("search") || "").trim();
      const category = String(searchParams.get("category") || "").trim();
      const rim = String(searchParams.get("rim") || "").trim();

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

      return json({ count: products.length, products });
    } catch (error) {
      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  if (scope === "auth" && resource === "profile") {
    const auth = getAuthUser(req);
    if (auth.error) return json({ message: auth.error.message }, { status: auth.error.status });

    try {
      const user = await prisma.user.findUnique({
        where: { id: auth.user.userId },
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
        return json({ message: "User tidak ditemukan" }, { status: 404 });
      }

      return json(user);
    } catch (error) {
      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  if (scope === "users" && resource) {
    const auth = getAuthUser(req);
    if (auth.error) return json({ message: auth.error.message }, { status: auth.error.status });

    const userId = parseNumericId(resource);
    if (!userId) {
      return json({ message: "User tidak valid" }, { status: 400 });
    }

    if (auth.user.userId !== userId && auth.user.role !== "ADMIN") {
      return json({ message: "Akses ditolak" }, { status: 403 });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
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
        return json({ message: "User tidak ditemukan" }, { status: 404 });
      }

      return json(user);
    } catch (error) {
      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  if (scope === "admin" && resource === "users") {
    const auth = getAuthUser(req);
    if (auth.error) return json({ message: auth.error.message }, { status: auth.error.status });
    const admin = requireAdmin(auth.user);
    if (admin.error) return json({ message: admin.error.message }, { status: admin.error.status });

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

      return json({ count: users.length, users });
    } catch (error) {
      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  if (scope === "orders" && !resource) {
    const auth = getAuthUser(req);
    if (auth.error) return json({ message: auth.error.message }, { status: auth.error.status });

    try {
      const where = auth.user.role === "ADMIN" ? {} : { userId: auth.user.userId };
      const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: buildOrderInclude
      });

      return json({ count: orders.length, orders });
    } catch (error) {
      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  if (scope === "users" && rest[0] === "orders") {
    const auth = getAuthUser(req);
    if (auth.error) return json({ message: auth.error.message }, { status: auth.error.status });

    const userId = parseNumericId(resource);
    if (!userId) {
      return json({ message: "User tidak valid" }, { status: 400 });
    }

    if (auth.user.userId !== userId && auth.user.role !== "ADMIN") {
      return json({ message: "Akses ditolak" }, { status: 403 });
    }

    try {
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

      return json({ count: orders.length, orders });
    } catch (error) {
      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  if (scope === "orders" && resource) {
    const auth = getAuthUser(req);
    if (auth.error) return json({ message: auth.error.message }, { status: auth.error.status });

    try {
      const order = await prisma.order.findUnique({
        where: { orderId: resource },
        include: buildOrderInclude
      });

      if (!order) {
        return json({ message: "Order tidak ditemukan" }, { status: 404 });
      }

      if (auth.user.userId !== order.userId && auth.user.role !== "ADMIN") {
        return json({ message: "Akses ditolak" }, { status: 403 });
      }

      return json(order);
    } catch (error) {
      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  return json({ message: "Route tidak ditemukan" }, { status: 404 });
}

export async function POST(req) {
  const [scope, resource, subresource] = getPathParts(req);

  if (scope === "auth" && resource === "register") {
    try {
      const { email, password, confirmPassword, name, phone, address } = await readJsonBody(req);

      if (!email || !password || !name) {
        return json({ message: "Email, password, dan name wajib diisi" }, { status: 400 });
      }

      if (password !== confirmPassword) {
        return json({ message: "Password tidak cocok" }, { status: 400 });
      }

      if (password.length < 6) {
        return json({ message: "Password minimal 6 karakter" }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return json({ message: "Email sudah terdaftar" }, { status: 409 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone: phone || null,
          address: address || null,
          role: "USER"
        }
      });

      const token = generateToken(user.id, user.email, user.role);

      return json({
        message: "Registrasi berhasil",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  if (scope === "auth" && resource === "login") {
    try {
      const { email, password } = await readJsonBody(req);

      if (!email || !password) {
        return json({ message: "Email dan password wajib diisi" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return json({ message: "Email atau password salah" }, { status: 401 });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return json({ message: "Email atau password salah" }, { status: 401 });
      }

      const token = generateToken(user.id, user.email, user.role);

      return json({
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  if (scope === "admin" && resource === "products") {
    const auth = getAuthUser(req);
    if (auth.error) return json({ message: auth.error.message }, { status: auth.error.status });
    const admin = requireAdmin(auth.user);
    if (admin.error) return json({ message: admin.error.message }, { status: admin.error.status });

    try {
      const data = normalizeProductInput(await readJsonBody(req));
      const validationError = validateProductInput(data);

      if (validationError) {
        return json({ message: validationError }, { status: 400 });
      }

      const existingProduct = await prisma.product.findUnique({
        where: { name: data.name },
        select: { id: true }
      });

      if (existingProduct) {
        return json({ message: `Produk dengan nama "${data.name}" sudah ada` }, { status: 409 });
      }

      const product = await prisma.product.create({ data });
      return json(product, { status: 201 });
    } catch (error) {
      if (error?.code === "P2002") {
        return json(
          { message: buildUniqueConstraintMessage(error, "Data produk sudah digunakan") },
          { status: 409 }
        );
      }

      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  if (scope === "admin" && resource === "products" && subresource === "image") {
    return json({ message: "Route tidak ditemukan" }, { status: 404 });
  }

  if (scope === "admin" && resource && subresource === "image") {
    const auth = getAuthUser(req);
    if (auth.error) return json({ message: auth.error.message }, { status: auth.error.status });
    const admin = requireAdmin(auth.user);
    if (admin.error) return json({ message: admin.error.message }, { status: admin.error.status });

    try {
      const formData = await req.formData();
      const image = formData.get("image");

      if (!image || typeof image === "string") {
        return json({ message: "Gambar wajib dipilih" }, { status: 400 });
      }

      const existingProduct = await prisma.product.findUnique({
        where: { id: resource },
        select: { image: true, imagePublicId: true }
      });

      if (!existingProduct) {
        return json({ message: "Produk tidak ditemukan" }, { status: 404 });
      }

      const safeName = resource.replace(/[^a-zA-Z0-9_-]/g, "-");
      const uploadResult = await uploadImageBuffer(Buffer.from(await image.arrayBuffer()), {
        folder: "surya-ban/products",
        public_id: `${safeName}-${Date.now()}`
      });

      const product = await prisma.product.update({
        where: { id: resource },
        data: {
          image: uploadResult.secure_url,
          imagePublicId: uploadResult.public_id
        }
      });

      await deleteCloudinaryImage(existingProduct.imagePublicId);
      return json(product);
    } catch (error) {
      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  if (scope === "orders") {
    const auth = getAuthUser(req);
    if (auth.error) return json({ message: auth.error.message }, { status: auth.error.status });

    try {
      const { cart, summary, paymentMethod } = await readJsonBody(req);

      if (!Array.isArray(cart) || cart.length === 0) {
        return json({ message: "Keranjang kosong" }, { status: 400 });
      }

      if (!supportedPayments.has(paymentMethod)) {
        return json({ message: "Metode pembayaran tidak didukung" }, { status: 400 });
      }

      const amount = Math.round(Number(summary?.grandTotal || 0));
      if (amount <= 0) {
        return json({ message: "Nominal transaksi tidak valid" }, { status: 400 });
      }

      const orderId = createOrderId();
      const status = paymentMethod === "COD" ? "COD" : "UNPAID";

      const record = await prisma.order.create({
        data: {
          orderId,
          refCode: createRefCode(),
          userId: auth.user.userId,
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
        include: buildOrderInclude
      });

      return json(record);
    } catch (error) {
      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  return json({ message: "Route tidak ditemukan" }, { status: 404 });
}

export async function PUT(req) {
  const [scope, resource, subresource] = getPathParts(req);

  if (scope === "auth" && resource === "profile") {
    const auth = getAuthUser(req);
    if (auth.error) return json({ message: auth.error.message }, { status: auth.error.status });

    try {
      const { name, phone, address } = await readJsonBody(req);
      const user = await prisma.user.update({
        where: { id: auth.user.userId },
        data: {
          name: name || undefined,
          phone: phone || undefined,
          address: address || undefined
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          address: true,
          role: true
        }
      });

      return json({
        message: "Profil berhasil diperbarui",
        user
      });
    } catch (error) {
      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  if (scope === "auth" && resource === "change-password") {
    const auth = getAuthUser(req);
    if (auth.error) return json({ message: auth.error.message }, { status: auth.error.status });

    try {
      const { currentPassword, newPassword, confirmPassword } = await readJsonBody(req);

      if (!currentPassword || !newPassword || !confirmPassword) {
        return json({ message: "Semua field wajib diisi" }, { status: 400 });
      }

      if (newPassword !== confirmPassword) {
        return json({ message: "Password baru tidak cocok" }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return json({ message: "Password minimal 6 karakter" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { id: auth.user.userId } });
      if (!user) {
        return json({ message: "User tidak ditemukan" }, { status: 404 });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return json({ message: "Password saat ini tidak sesuai" }, { status: 401 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: auth.user.userId },
        data: { password: hashedPassword }
      });

      return json({ message: "Password berhasil diubah" });
    } catch (error) {
      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  if (scope === "admin" && resource === "products") {
    return json({ message: "Route tidak ditemukan" }, { status: 404 });
  }

  if (scope === "admin" && resource) {
    const auth = getAuthUser(req);
    if (auth.error) return json({ message: auth.error.message }, { status: auth.error.status });
    const admin = requireAdmin(auth.user);
    if (admin.error) return json({ message: admin.error.message }, { status: admin.error.status });

    try {
      const existingProduct = await prisma.product.findUnique({
        where: { id: resource },
        select: { image: true, imagePublicId: true }
      });

      if (!existingProduct) {
        return json({ message: "Produk tidak ditemukan" }, { status: 404 });
      }

      const data = normalizeProductInput(await readJsonBody(req));
      const validationError = validateProductInput(data, true);

      if (validationError) {
        return json({ message: validationError }, { status: 400 });
      }

      if (Object.hasOwn(data, "image") && data.image !== existingProduct.image) {
        data.imagePublicId = null;
      }

      const product = await prisma.product.update({
        where: { id: resource },
        data
      });

      return json(product);
    } catch (error) {
      if (error?.code === "P2025") {
        return json({ message: "Produk tidak ditemukan" }, { status: 404 });
      }

      if (error?.code === "P2002") {
        return json(
          { message: buildUniqueConstraintMessage(error, "Data produk sudah digunakan") },
          { status: 409 }
        );
      }

      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  return json({ message: "Route tidak ditemukan" }, { status: 404 });
}

export async function PATCH(req) {
  const [scope, resource, subresource] = getPathParts(req);

  if (scope === "orders" && subresource === "status") {
    const auth = getAuthUser(req);
    if (auth.error) return json({ message: auth.error.message }, { status: auth.error.status });
    const admin = requireAdmin(auth.user);
    if (admin.error) return json({ message: admin.error.message }, { status: admin.error.status });

    try {
      const { status: requestedStatus } = await readJsonBody(req);
      const nextStatus = String(requestedStatus || "").toUpperCase();

      if (!supportedStatuses.has(nextStatus)) {
        return json({ message: "Status tidak valid" }, { status: 400 });
      }

      const order = await prisma.order.findUnique({
        where: { orderId: resource }
      });

      if (!order) {
        return json({ message: "Order tidak ditemukan" }, { status: 404 });
      }

      const updatedOrder = await prisma.order.update({
        where: { orderId: resource },
        data: {
          status: nextStatus,
          paidAt: nextStatus === "PAID" ? order.paidAt ?? new Date() : order.paidAt
        },
        include: buildOrderInclude
      });

      return json(updatedOrder);
    } catch (error) {
      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  return json({ message: "Route tidak ditemukan" }, { status: 404 });
}

export async function DELETE(req) {
  const [scope, resource] = getPathParts(req);

  if (scope === "admin" && resource) {
    const auth = getAuthUser(req);
    if (auth.error) return json({ message: auth.error.message }, { status: auth.error.status });
    const admin = requireAdmin(auth.user);
    if (admin.error) return json({ message: admin.error.message }, { status: admin.error.status });

    try {
      const product = await prisma.product.findUnique({
        where: { id: resource }
      });

      if (!product) {
        return json({ message: "Produk tidak ditemukan" }, { status: 404 });
      }

      await prisma.product.delete({
        where: { id: resource }
      });

      await deleteCloudinaryImage(product.imagePublicId);
      return json({ message: "Produk berhasil dihapus" });
    } catch (error) {
      return json({ message: error.message || "Internal server error" }, { status: 500 });
    }
  }

  return json({ message: "Route tidak ditemukan" }, { status: 404 });
}
