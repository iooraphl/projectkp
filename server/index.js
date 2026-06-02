import crypto from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const webOrigin = process.env.WEB_ORIGIN || "http://localhost:5173";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const ordersFilePath = path.join(dataDir, "orders.json");

const manualBankInfo = {
  bank: process.env.MANUAL_BANK_NAME || "BCA",
  accountNumber: process.env.MANUAL_BANK_ACCOUNT_NUMBER || "1234567890",
  accountName: process.env.MANUAL_BANK_ACCOUNT_NAME || "PT Surya Ban Nusantara"
};

const orderStore = new Map();
const supportedPayments = new Set(["Transfer Bank", "Bayar di Tempat"]);
const supportedStatuses = new Set([
  "UNPAID",
  "COD",
  "WAITING_CONFIRMATION",
  "PAID",
  "CANCELLED"
]);
let persistQueue = Promise.resolve();

app.use(cors({ origin: webOrigin }));
app.use(express.json());

const queuePersistOrders = () => {
  persistQueue = persistQueue
    .then(async () => {
      await mkdir(dataDir, { recursive: true });
      const allOrders = [...orderStore.values()];
      await writeFile(ordersFilePath, JSON.stringify(allOrders, null, 2), "utf8");
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error("Gagal menyimpan order:", error.message);
    });
  return persistQueue;
};

const loadOrdersFromDisk = async () => {
  try {
    const raw = await readFile(ordersFilePath, "utf8");
    const safeRaw = raw.replace(/^\uFEFF/, "");
    const savedOrders = JSON.parse(safeRaw);
    if (Array.isArray(savedOrders)) {
      for (const order of savedOrders) {
        if (order?.orderId) {
          orderStore.set(order.orderId, order);
        }
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      // eslint-disable-next-line no-console
      console.error("Gagal membaca data order:", error.message);
    }
  }
};

const buildMethodLabel = (paymentPreference) =>
  paymentPreference === "Transfer Bank" ? "Transfer Manual" : "COD";

const createOrderId = () =>
  `SB-MANUAL-${Date.now()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

const createRefCode = () =>
  `REF-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

app.get("/api/health", (_, res) => {
  res.json({
    ok: true,
    provider: "manual",
    storage: "json-file"
  });
});

app.get("/api/orders", (_, res) => {
  const orders = [...orderStore.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json({ count: orders.length, orders });
});

app.post("/api/orders", async (req, res) => {
  try {
    const { customer, cart, summary, paymentPreference } = req.body || {};
    if (!customer?.name || !customer?.phone || !customer?.address) {
      return res.status(400).json({ message: "Data customer tidak lengkap" });
    }
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Keranjang kosong" });
    }
    if (!supportedPayments.has(paymentPreference)) {
      return res.status(400).json({ message: "Metode pembayaran tidak didukung" });
    }

    const amount = Math.round(Number(summary?.grandTotal || 0));
    if (amount <= 0) {
      return res.status(400).json({ message: "Nominal transaksi tidak valid" });
    }

    const now = new Date().toISOString();
    const orderId = createOrderId();
    const status = paymentPreference === "Bayar di Tempat" ? "COD" : "UNPAID";
    const record = {
      orderId,
      refCode: createRefCode(),
      status,
      provider: "manual",
      method: paymentPreference,
      methodLabel: buildMethodLabel(paymentPreference),
      amount,
      customer: customer.name,
      customerPhone: customer.phone,
      address: customer.address,
      bankInfo: paymentPreference === "Transfer Bank" ? manualBankInfo : null,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.size,
        qty: item.qty,
        price: item.price
      })),
      summary: {
        subtotal: Number(summary?.subtotal || 0),
        serviceFee: Number(summary?.serviceFee || 0),
        paymentFee: Number(summary?.paymentFee || 0),
        grandTotal: amount
      },
      createdAt: now,
      updatedAt: now
    };

    orderStore.set(orderId, record);
    await queuePersistOrders();
    return res.json(record);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
});

app.get("/api/orders/:orderId", (req, res) => {
  const order = orderStore.get(req.params.orderId);
  if (!order) return res.status(404).json({ message: "Order tidak ditemukan" });
  return res.json(order);
});

app.patch("/api/orders/:orderId/status", async (req, res) => {
  try {
    const order = orderStore.get(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order tidak ditemukan" });

    const nextStatus = String(req.body?.status || "").toUpperCase();
    if (!supportedStatuses.has(nextStatus)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const updatedOrder = {
      ...order,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
      paidAt:
        nextStatus === "PAID" ? order.paidAt || new Date().toISOString() : order.paidAt
    };
    orderStore.set(req.params.orderId, updatedOrder);
    await queuePersistOrders();
    return res.json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
});

loadOrdersFromDisk().finally(() => {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Payment server running on http://localhost:${port}`);
  });
});
