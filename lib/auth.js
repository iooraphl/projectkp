import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "your-secret-key";

export const generateToken = (userId, email, role) =>
  jwt.sign(
    { userId, email, role },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

export const getUserFromRequest = (req) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: { status: 401, message: "Token tidak ditemukan" } };
  }

  const token = authHeader.slice(7);

  try {
    const user = jwt.verify(token, jwtSecret);
    return { user };
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      return { error: { status: 401, message: "Token sudah kadaluarsa" } };
    }

    return { error: { status: 401, message: "Token tidak valid" } };
  }
};
