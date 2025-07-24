const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || "sekret_i_fshehte";

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Token mungon!" });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token i pavlefshëm!" });
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Leje e pamjaftueshme!" });
}

module.exports = { verifyToken, isAdmin };
