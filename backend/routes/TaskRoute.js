const { Router } = require("express");
const { getTask, saveTask, updateTask, deleteTask } = require("../controllers/TaskController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = Router();

// Todas as rotas de tarefas passam pelo middleware
router.use(authMiddleware);

router.get("/", getTask);
router.post("/save", saveTask);
router.post("/update", updateTask);
router.post("/delete", deleteTask);

module.exports = router;
