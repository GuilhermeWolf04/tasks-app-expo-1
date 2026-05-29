const jwt = require("jsonwebtoken");

module.exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET || "default_secret", (err, user) => {
      if (err) {
        // Se houver um token mas for inválido, podemos continuar sem user
        // ou retornar 403. Aqui optamos por prosseguir como visitante ou falhar?
        // É mais seguro falhar caso enviem token inválido.
        return res.status(403).json({ error: "Token inválido ou expirado." });
      }
      req.user = user; // Popula com { id: ..., email: ... }
      next();
    });
  } else {
    // Sem token, continua como não logado (visitante)
    req.user = null;
    next();
  }
};
