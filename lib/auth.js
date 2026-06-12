import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV !== "production" ? "your-secret-key" : null);

if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required in production.");
}

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
