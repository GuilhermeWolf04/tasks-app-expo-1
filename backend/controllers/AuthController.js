const db = require("../models/TaskModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (email, password) VALUES (?, ?)`,
      [email, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE constraint failed")) {
            return res.status(400).json({ error: "E-mail já cadastrado." });
          }
          console.log(err);
          return res.status(500).json({ error: "Erro ao criar usuário." });
        }

        const token = jwt.sign(
          { id: this.lastID, email },
          process.env.JWT_SECRET || "default_secret",
          { expiresIn: "7d" }
        );

        res.status(201).json({ token, user: { id: this.lastID, email } });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno." });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro no servidor." });
    }

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user.id, email: user.email } });
  });
};

module.exports.logout = (req, res) => {
  // Para APIs REST stateful JWT, o logout é no client-side.
  res.json({ message: "Logout realizado com sucesso." });
};
