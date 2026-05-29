const http = require('http');

async function testFlow() {
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  
  console.log("Testing API...");

  try {
    // 1. Get as visitor
    console.log("\\n--- 1. GET / sem token ---");
    const res1 = await fetch("http://localhost:5555/");
    const data1 = await res1.json();
    console.log(`Tarefas encontradas: ${data1.length}`);
    if (data1.length === 10) console.log("OK: 10 tarefas seed retornadas.");

    // 2. Signup
    console.log("\\n--- 2. POST /api/auth/signup ---");
    const res2 = await fetch("http://localhost:5555/api/auth/signup", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: '123' })
    });
    const data2 = await res2.json();
    console.log("Signup retornado:", data2);
    const token = data2.token;

    // 3. Create task as logged user
    console.log("\\n--- 3. POST /save com token ---");
    const res3 = await fetch("http://localhost:5555/save", {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text: 'Minha nova tarefa', dueDate: new Date().toISOString(), completed: false })
    });
    const data3 = await res3.json();
    console.log("Tarefa criada:", data3);

    // 4. Get as logged user (should return ONLY my task)
    console.log("\\n--- 4. GET / com token ---");
    const res4 = await fetch("http://localhost:5555/", {
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    const data4 = await res4.json();
    console.log(`Tarefas encontradas (logado): ${data4.length}`);
    if (data4.length === 1 && data4[0].text === 'Minha nova tarefa') {
      console.log("OK: Apenas a minha tarefa retornada.");
    } else {
      console.error("FAIL: Retornou algo diferente de apenas a minha tarefa:", data4);
    }
  } catch(err) {
    console.error("Erro no teste:", err);
  }
}

testFlow();
