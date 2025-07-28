const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ msg: "Nuk ka token." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Token i pavlefshëm." });
  }
}

function isAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ msg: "Vetëm admini ka qasje në këtë faqe." });
  }
  next();
}

module.exports = {
  verifyToken,
  isAdmin
};
