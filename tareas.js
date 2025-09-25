const STORAGE_KEY = 'tareas'; // Nombre para guardar las tareas en el navegador
const entrada = document.getElementById('entrada'); // Caja de texto donde escribes la tarea
const btnAgregar = document.getElementById('agregar'); // Botón para añadir la tarea
const lista = document.getElementById('lista'); // Lista donde se muestran las tareas

let tareas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; // Carga las tareas guardadas o crea una lista vacía

function guardar() { // Guarda la lista de tareas en el navegador
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas)); // Convierte la lista en texto y la guarda
}

function render() { // Dibuja la lista de tareas en la página
  // Ordena las tareas: primero las no completadas, luego las completadas
  const tareasOrdenadas = [
    ...tareas.filter(t => !t.completed),
    ...tareas.filter(t => t.completed)
  ];
  lista.innerHTML = tareasOrdenadas.map((t, i) => `
    <li style="display: flex; align-items: center;">
      <input type="checkbox" ${t.completed ? 'checked' : ''} data-i="${tareas.indexOf(t)}"> <!-- Casilla para marcar si está hecha -->
      <span${t.completed ? ' style="text-decoration:line-through; margin-left:8px;"' : ' style="margin-left:8px;"'}>${t.text}</span> <!-- Texto de la tarea, tachado si está hecha -->
      <button data-i="${tareas.indexOf(t)}" style="margin-left:auto;">🗑</button> <!-- Botón para borrar la tarea, alineado a la derecha -->
    </li>
  `).join('');
}

function agregarTarea() { // Añade una nueva tarea
  const texto = entrada.value.trim(); // Coge el texto y quita espacios
  if (!texto) return; // Si está vacío, no hace nada
  tareas.push({ text: texto, completed: false }); // Añade la tarea como no hecha
  guardar(); // Guarda la lista actualizada
  render(); // Dibuja la lista actualizada
  entrada.value = ''; // Limpia la caja de texto
  entrada.focus(); // Vuelve a poner el cursor en la caja de texto
}

btnAgregar.onclick = agregarTarea; // Cuando haces clic en el botón, añade la tarea
entrada.onkeydown = e => { if (e.key === 'Enter') agregarTarea(); }; // Si pulsas Enter en la caja, añade la tarea

lista.onclick = e => { // Cuando haces clic en la lista de tareas
  const i = e.target.dataset.i; // Coge el número de la tarea
  if (e.target.tagName === 'BUTTON') { // Si pulsas el botón de borrar
    tareas.splice(i, 1); // Borra la tarea de la lista
    guardar(); // Guarda la lista actualizada
    render(); // Dibuja la lista actualizada
  }
  if (e.target.type === 'checkbox') { // Si pulsas la casilla de hecho/no hecho
    tareas[i].completed = !tareas[i].completed; // Cambia el estado de la tarea
    guardar(); // Guarda la lista actualizada
    render(); // Dibuja la lista actualizada
  }
};

render(); // Dibuja la lista al principio