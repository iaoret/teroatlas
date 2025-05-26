import { Router } from "express";
import jwt from "jsonwebtoken";
import md5 from "md5";
import { findUserByUsername, createUser } from "../service/user";
import { authenticateJWT, requireSU } from "../middleware/auth";
import { User } from "../interface/auth";
import { logError } from "../logger";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";

function generateTokens(user: User) {
  const payload = { id: user.id, username: user.username, su: user.su };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { token, refreshToken };
}

router.post("/register", authenticateJWT, requireSU, async (req, res) => {
  try {
    const { username, password, su } = req.body;
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      (su !== undefined && typeof su !== "boolean")
    ) {
      return res.status(400).json({ message: "Invalid input types" });
    }
    const existing = await findUserByUsername(username);
    if (existing) return res.status(409).json({ message: "User exists" });
    const user = await createUser(username, password, su);
    res.status(201).json({ id: user.id, username: user.username, su: user.su });
  } catch (err) {
    logError(err, "/register");
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid input types" });
    }
    const user = await findUserByUsername(username);
    if (!user || user.password !== md5(password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const tokens = generateTokens(user);
    res.json(tokens);
  } catch (err) {
    logError(err, "/login");
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (typeof refreshToken !== "string") {
      return res
        .status(400)
        .json({ message: "Missing or invalid refresh token" });
    }
    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
      if (err || !user) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      const tokens = generateTokens(user as User);
      res.json(tokens);
    });
  } catch (err) {
    logError(err, "/refresh");
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
