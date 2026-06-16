import { whatsappNumber } from "../constants/storeData";
import { formatIDR } from "./format";

function buildIntentText(intent) {
  if (intent === "checkout") {
    return "checkout";
  }

  if (intent === "consult") {
    return "konsultasi";
  }

  return intent || "konsultasi";
}

export function createWhatsAppLink({ product = null, intent = "consult" } = {}) {
  const timestamp = new Date().toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta"
  });

  const actionText = buildIntentText(intent);
  const lines = [
    `Halo Surya Ban, saya ingin ${actionText}${product ? " untuk produk berikut:" : "."}`,
    "",
    `Waktu: ${timestamp}`,
    product ? `Produk: ${product.name}` : null,
    product ? `Ukuran: ${product.size}` : null,
    product ? `Kategori: ${product.category}` : null,
    product ? `Rim: ${product.rim}` : null,
    product ? `Harga: ${formatIDR(product.price)}` : null,
    product ? `Mobil cocok: ${product.compatibleCars}` : null,
    "",
    intent === "checkout"
      ? "Mohon bantu proses checkout dan konfirmasi stoknya."
      : "Mohon bantu cek kecocokan ban ini dengan mobil saya.",
    "",
    "Terima kasih."
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? whatsappNumber).replace(/\D/g, "");

  return `https://wa.me/${phone}?text=${text}`;
}
