import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "your-secret-key";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, jwtSecret);
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token sudah kadaluarsa" });
    }
    return res.status(401).json({ message: "Token tidak valid" });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Akses hanya untuk admin" });
  }
  next();
};

export const generateToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};
