import { useEffect, useState } from "react";
import axios from "axios"; //crud pgpd
import "./App.css";

function App() {

  const [task, setTask] = useState(""); //current,update
  const [todos, setTodos] = useState([]);//backend store, update
  const [editId, setEditId] = useState(null);//
  const [editTask, setEditTask] = useState("");//temp stores while typing before saving

  const BASE_URL = "http://localhost:8080/todos";

  const fetchTodos = async () => { //async waits for backend response without freezing UI
    const response = await axios.get(BASE_URL);
    setTodos(response.data);
  };
  useEffect(() => { //fetchTodos is an asynchronous function used to retrieve all todo tasks from the backend using Axios GET request and store them in React state using setTodos()

    const loadTodos = async () => {
      await fetchTodos();
    };

    loadTodos();

  }, []);

  const addTodo = async () => { //add new task

    if (task.trim() === "") return; //Prevents empty tasks.

    await axios.post(BASE_URL, {
      task: task, // pos crerate tas req to backend
      completed: false
    });

    setTask("");
    fetchTodos();
  };

  const toggleTodo = async (id) => {//task status
    await axios.put(`${BASE_URL}/${id}`);
    fetchTodos();
  };

  const deleteTodo = async (id) => { //perm del frnt back db
    await axios.delete(`${BASE_URL}/${id}`); //http del req to backend
    fetchTodos();
  }; // click del,axios send del req. backend del task in db, rnt refereshes

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditTask(todo.task);
  };

  const saveEdit = async (id) => {

    if (editTask.trim() === "") return;

    try {

      const currentTodo = todos.find(todo => todo.id === id);

      await axios.put(`${BASE_URL}/edit/${id}`, {
        id: id,
        task: editTask,
        completed: currentTodo.completed
      });

      setEditId(null);
      setEditTask("");

      fetchTodos();

    } catch (error) {
      console.log(error);
    }
  };

  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="app">

      <div className="todo-container">

        <div className="header">
          <h1>To-Do List</h1>
          <p>Organize and Manage</p>
        </div>

        <div className="input-section">

          <input
            type="text"
            placeholder="Enter your task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <button onClick={addTodo}>
            Add Task
          </button>

        </div>

        <div className="stats">

          <div className="card pending-card">
            <h2>{pendingTodos.length}</h2>
            <p>Pending</p>
          </div>

          <div className="card completed-card">
            <h2>{completedTodos.length}</h2>
            <p>Completed</p>
          </div>

        </div>

        <div className="todo-sections">
          <div className="todo-box">

            <h2>📝Pending Tasks</h2>

            {pendingTodos.length === 0 ? (

              <p className="empty">No pending tasks</p>

            ) : (

              pendingTodos.map(todo => (

                <div className="todo-item" key={todo.id}>

                  {editId === todo.id ? (

                    <input
                      type="text"
                      value={editTask}
                      onChange={(e) => setEditTask(e.target.value)}
                      className="edit-input"
                    />

                  ) : (

                    <span>{todo.task}</span>

                  )}

                  <div className="buttons">

                    {editId === todo.id ? (

                      <button
                        className="complete-btn"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          saveEdit(todo.id);
                        }}
                      >
                        Save
                      </button>

                    ) : (

                      <button
                        className="undo-btn"
                        onClick={() => startEdit(todo)}
                      >
                        Edit
                      </button>

                    )}

                    <button
                      className="complete-btn"
                      onClick={() => toggleTodo(todo.id)}
                    >
                      Complete
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))
            )}

          </div>

          <div className="todo-box">

            <h2>✅Completed Tasks</h2>

            {completedTodos.length === 0 ? (

              <p className="empty">No completed tasks</p>

            ) : (

              completedTodos.map(todo => (

                <div className="todo-item completed" key={todo.id}>

                  <span>{todo.task}</span>

                  <div className="buttons">

                    <button
                      className="undo-btn"
                      onClick={() => toggleTodo(todo.id)}
                    >
                      Undo
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;