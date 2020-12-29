const Todo = (app) => {
  app.innerHTML += `
  <div class="main">
    <h2>Visma's to do app</h2>
    <form id='todo-form'>
      <input type='text' name='input' placeholder="Your new task" required maxlength="160">
      <input type="datetime-local" name="date" min="${new Date()
        .toISOString()
        .slice(0, 16)}">
      <button type='submit'>Add</button>
    </form>
    <ul class='list'></ul>
  </div>
  `
  let allTasks = JSON.parse(sessionStorage.getItem('todos')) || []
  const todoList = document.querySelector('.list')

  // Create task component
  const createTask = (task) => {
    //Count time
    let currentTime = new Date()
    const differenceTime = Math.floor(
      (new Date(task.date) - currentTime) / 1000
    )
    const minutes = Math.floor((differenceTime / 60) % 60)
    const hours = Math.floor(differenceTime / 3600) % 24
    const days = Math.floor(differenceTime / 3600 / 24)
    const taskElement = document.createElement('li')
    // Set element ID
    taskElement.setAttribute('id', task.id)
    // Create component
    const taskElementContent = `<div class=${
      task.isCompleted ? 'completed' : ''
    }>
    <input class='checkboxBtn' type="checkbox" id="${task.name}-${
      task.id
    }" name="tasks" ${task.isCompleted ? 'checked' : ''}>
    <div class='taskContent'>
    <span span="task">  ${task.task} </span>
    <span class="timeLeft">
    ${
      !task.isCompleted
        ? task.date
          ? `Time Left: ${days}days ${hours} hours ${minutes} minutes`
          : ''
        : ''
    }</span>
    </div>
    <button type='submit' class='deleteBtn' id=${task.id}>Delete</button>

    </div>`
    // Append component
    taskElement.innerHTML = taskElementContent
    todoList.append(taskElement)
  }
  // Sorting function (could be simplified?)
  const sortData = () => {
    if (sessionStorage.getItem('todos')) {
      const sortedTasks = allTasks.sort((a, b) => {
        if (a.date && !b.date) return -1
        if (b.date && !a.date) return 1
        return a.date.localeCompare(b.date) || a.task.localeCompare(b.task)
      })
      sortedTasks.sort((a, b) => b.completed - a.completed)
      sortedTasks.sort((a, b) => a.isCompleted - b.isCompleted)
      sortedTasks.map((task) => {
        createTask(task)
      })
    }
  }

  // Creating tasks in the DOM
  sortData()

  // Look for checkbox event
  todoList.addEventListener('click', (e) => {
    const taskId = e.target.closest('li').id
    updateTask(taskId, e.target)
  })

  // Manipulation of task for checkbox event
  function updateTask(taskId, el) {
    let task = allTasks.find((task) => task.id === parseInt(taskId))
    task.isCompleted = !task.isCompleted
    // Adding new id for sorting purposes
    task.completed == '' ? (task.completed = new Date()) : (task.completed = '')
    if (task.isCompleted) {
      el.setAttribute('checked', true)
    } else {
      el.removeAttribute('checked')
    }
    sessionStorage.setItem('todos', JSON.stringify(allTasks))
    // Re-rendering tasks
    todoList.innerHTML = ''
    sortData()
  }

  // Delete listener
  todoList.addEventListener('click', (e) => {
    e.preventDefault()
    e.target.classList.contains('deleteBtn') ? deleteTask(e.target.id) : null
  })

  const deleteTask = (id) => {
    if (confirm('Do you really want to delete this task?')) {
      allTasks = allTasks.filter((task) => task.id !== parseInt(id))
      sessionStorage.setItem('todos', JSON.stringify(allTasks))
      document.getElementById(id).remove()
    }
  }

  // Form Listener for creation of a new task
  document.querySelector('#todo-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const date = e.target.date.value
    const task = e.target.input.value
    const id = new Date().getTime()
    const newTodo = { date, task, isCompleted: false, id, completed: '' }
    allTasks.push(newTodo)
    sessionStorage.setItem('todos', JSON.stringify(allTasks))
    e.target.input.value = ''
    e.target.date.value = ''
    todoList.innerHTML = ''
    sortData()
  })
}

export default Todo
