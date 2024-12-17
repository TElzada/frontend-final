const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const filters = document.querySelectorAll('.filter');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks(filter = 'all') {
  taskList.innerHTML = ''; // Очистка списка задач

  let filteredTasks;
  // Фильтрация задач
  if (filter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (filter === 'incomplete') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else {
    filteredTasks = tasks; // Показать все задачи
  }

  // Рендеринг каждой задачи
  filteredTasks.forEach(task => {
    const taskItem = document.createElement('li');

    // Текст задачи
    const taskText = document.createElement('span');
    taskText.className = `task-text ${task.completed ? 'completed' : ''}`;
    taskText.textContent = task.text;

    // Кнопка "Завершить"
    const completeButton = document.createElement('button');
    completeButton.textContent = task.completed ? 'Undo' : 'Complete';
    completeButton.className = 'complete';
    completeButton.onclick = () => toggleTaskCompletion(task.id);

    // Кнопка "Удалить"
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete';
    deleteButton.onclick = () => deleteTask(task.id);

    // Добавляем элементы в DOM
    taskItem.appendChild(taskText);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);
  });

  console.log('Rendered tasks:', filteredTasks); // Отладка
}

function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ id: Date.now(), text, completed: false });
    taskInput.value = '';
    updateLocalStorage();
    renderTasks();
  }
}

function deleteTask(taskId) {
  console.log('Deleting task with ID:', taskId); // Отладка
  tasks = tasks.filter(task => task.id !== taskId);
  updateLocalStorage();
  renderTasks(document.querySelector('.filter.active').dataset.filter);
}

function toggleTaskCompletion(taskId) {
  console.log('Toggling completion for task ID:', taskId); // Отладка
  const task = tasks.find(task => task.id === taskId);
  if (task) {
    task.completed = !task.completed;
    updateLocalStorage();
    renderTasks(document.querySelector('.filter.active').dataset.filter);
  }
}

function updateLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

filters.forEach(filterButton => {
  filterButton.addEventListener('click', () => {
    document.querySelector('.filter.active').classList.remove('active');
    filterButton.classList.add('active');
    renderTasks(filterButton.dataset.filter);
  });
});

document.getElementById('addTask').onclick = addTask;

renderTasks();
