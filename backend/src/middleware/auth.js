import { verifyToken } from "../utils/jwt.js";
import { User } from "../models/User.js";
import { Role } from "../models/Role.js";

export async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED" } });
  }

  const token = header.slice("Bearer ".length);

  try {
    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.userId, { include: Role });

    if (!user) {
      return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED" } });
    }

    req.user = {
      id: user.id,
      email: user.email,
      roles: user.Roles ? user.Roles.map(r => r.name) : []
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: { code: "INVALID_TOKEN" } });
  }
}

export function requireRole(requiredRole) {
  return (req, res, next) => {
    const roles = req.user?.roles || [];
    if (!roles.includes(requiredRole)) {
      return res.status(403).json({ success: false, error: { code: "FORBIDDEN" } });
    }
    next();
  };
}
