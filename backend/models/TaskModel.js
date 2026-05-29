const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    text TEXT NOT NULL,
    dueDate TEXT,
    completed BOOLEAN DEFAULT 0,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);

  // Inserir 10 tarefas de exemplo
  const stmt = db.prepare("INSERT INTO tasks (userId, text, dueDate, completed) VALUES (?, ?, ?, ?)");
  for (let i = 1; i <= 10; i++) {
    const isCompleted = i % 2 === 0; // Metade concluída, metade não
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + i); // Prazos para os próximos 10 dias
    
    stmt.run(null, `Tarefa de exemplo ${i} gerada automaticamente`, dueDate.toISOString(), isCompleted);
  }
  stmt.finalize();
});

module.exports = db;
