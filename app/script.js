// 1. Inicializar Firebase (substitua com seus dados)
const firebaseConfig = {
  apiKey: "AIzaSyBjrx7GduwzfSQyr7DCt0oS9GJg89ro1KA",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const tasksRef = db.ref('tasks');

// 2. Elementos DOM
const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('taskList');

// 3. Adicionar nova tarefa
addBtn.onclick = () => {
  const text = input.value.trim();
  if (!text) return;
  const newRef = tasksRef.push();
  newRef.set({ text, done: false });
  input.value = '';
};

// 4. Atualizar HTML quando o banco mudar (em tempo real)
tasksRef.on('value', snapshot => {
  list.innerHTML = '';
  snapshot.forEach(child => {
    const key = child.key;
    const { text, done } = child.val();
    const li = document.createElement('li');
    li.className = done ? 'completed' : '';
    li.innerHTML = `
      <span class="text">${text}</span>
      <div class="btns">
        <button onclick="toggle('${key}', ${!done})">${done ? '↺' : '✔'}</button>
        <button onclick="edit('${key}', '${text}')">✎</button>
        <button onclick="del('${key}')">🗑</button>
      </div>`;
    list.appendChild(li);
  });
});

// 5. Funções de manipulação
function toggle(key, done) { tasksRef.child(key).update({ done }); }
function edit(key, old) {
  const newText = prompt('Editar meta:', old);
  if (newText !== null) tasksRef.child(key).update({ text: newText });
}
function del(key) { tasksRef.child(key).remove(); }
