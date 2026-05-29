const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/TaskRoute");
const authRoutes = require("./routes/AuthRoute");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use(taskRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
