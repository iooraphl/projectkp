import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { seedProducts } from "./seed-products.js";

dotenv.config();

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const adminEmail = process.env.ADMIN_EMAIL || "admin@suryaban.local";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
const adminName = process.env.ADMIN_NAME || "Surya Ban Admin";

async function main() {
  const password = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      password,
      role: "ADMIN"
    },
    create: {
      email: adminEmail,
      password,
      name: adminName,
      role: "ADMIN"
    }
  });

  console.log(`Seeded admin user: ${admin.email}`);

  for (const product of seedProducts) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: product,
      create: product
    });
  }

  console.log(`Seeded products: ${seedProducts.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
