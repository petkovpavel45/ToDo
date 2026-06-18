import { useState, useEffect } from "react";
import "./index.css";

const FILTERS = ["All", "Active", "Done"];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tasks")) || [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [
      { id: Date.now(), text, completed: false },
      ...prev,
    ]);
    setInput("");
  };

  const toggleTask = (id) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTask = (id) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const clearDone = () =>
    setTasks((prev) => prev.filter((t) => !t.completed));

  const filtered = tasks.filter((t) => {
    if (filter === "Active") return !t.completed;
    if (filter === "Done") return t.completed;
    return true;
  });

  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <div className="card">
        {/* Header */}
        <div className="header">
          <h1>
            My <span>Tasks</span>
          </h1>
          <p>Stay organised, get things done.</p>
        </div>

        {/* Input */}
        <div className="input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a new task..."
            maxLength={120}
          />
          <button className="add-btn" onClick={addTask} title="Add task">
            +
          </button>
        </div>

        {/* Filters */}
        <div className="filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Stats */}
        <p className="stats">
          {remaining} task{remaining !== 1 ? "s" : ""} remaining
        </p>

        {/* Task list */}
        <div className="task-list">
          {filtered.length === 0 ? (
            <p className="empty">
              {filter === "Done"
                ? "No completed tasks yet."
                : filter === "Active"
                ? "No active tasks — great job!"
                : "Add your first task above."}
            </p>
          ) : (
            filtered.map((task) => (
              <div
                key={task.id}
                className={`task-item ${task.completed ? "done" : ""}`}
              >
                <button
                  className={`check-btn ${task.completed ? "checked" : ""}`}
                  onClick={() => toggleTask(task.id)}
                  title="Toggle complete"
                >
                  {task.completed && "✓"}
                </button>
                <span className="task-text">{task.text}</span>
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {tasks.some((t) => t.completed) && (
          <div className="footer">
            <span>{tasks.filter((t) => t.completed).length} completed</span>
            <button className="clear-btn" onClick={clearDone}>
              Clear completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
