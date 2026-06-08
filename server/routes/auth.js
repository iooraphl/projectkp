import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../middleware/auth.js";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  try {
    const { email, password, confirmPassword, name, phone, address } = req.body || {};

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, password, dan name wajib diisi" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password tidak cocok" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
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

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    return res.json({
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
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    return res.json({
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
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
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

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body || {};

    const user = await prisma.user.update({
      where: { id: req.user.userId },
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

    return res.json({
      message: "Profil berhasil diperbarui",
      user
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body || {};

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Password baru tidak cocok" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password saat ini tidak sesuai" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedPassword }
    });

    return res.json({ message: "Password berhasil diubah" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};
