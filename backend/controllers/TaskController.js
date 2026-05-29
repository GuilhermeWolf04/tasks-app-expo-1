const db = require("../models/TaskModel");

module.exports.getTask = async (req, res) => {
  let query = "SELECT * FROM tasks WHERE userId IS NULL";
  let params = [];

  if (req.user) {
    // Caso logado: ver apenas as tarefas que ele criou
    query = "SELECT * FROM tasks WHERE userId = ?";
    params = [req.user.id];
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching data");
    }
    const tasks = rows.map(row => ({
      ...row,
      completed: !!row.completed
    }));
    res.send(tasks);
  });
};

module.exports.saveTask = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Apenas usuários logados podem criar tarefas." });
  }

  const { text, dueDate, completed } = req.body;
  const isCompleted = completed ? 1 : 0;
  const userId = req.user.id;

  db.run(
    `INSERT INTO tasks (userId, text, dueDate, completed) VALUES (?, ?, ?, ?)`,
    [userId, text, dueDate, isCompleted],
    function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send("Error saving data");
      }
      
      const data = { _id: this.lastID, userId, text, dueDate, completed: !!isCompleted };
      res.send(data);
    }
  );
};

module.exports.updateTask = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Apenas usuários logados podem atualizar tarefas." });
  }

  const { _id, text, dueDate, completed } = req.body;
  const isCompleted = completed ? 1 : 0;
  const userId = req.user.id;

  db.run(
    `UPDATE tasks SET text = ?, dueDate = ?, completed = ? WHERE _id = ? AND userId = ?`,
    [text, dueDate, isCompleted, _id, userId],
    function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send("Error updating data");
      }
      if (this.changes === 0) {
        return res.status(404).send("Tarefa não encontrada ou não pertence a este usuário.");
      }
      res.send("Os dados foram atualizados...");
    }
  );
};

module.exports.deleteTask = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Apenas usuários logados podem deletar tarefas." });
  }

  const { _id } = req.body;
  const userId = req.user.id;

  db.run(`DELETE FROM tasks WHERE _id = ? AND userId = ?`, [_id, userId], function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send("Error deleting data");
    }
    if (this.changes === 0) {
        return res.status(404).send("Tarefa não encontrada ou não pertence a este usuário.");
    }
    res.send("Os dados foram deletados...");
  });
};
