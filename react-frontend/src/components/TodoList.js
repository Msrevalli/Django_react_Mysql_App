import React, { useState, useEffect } from "react";
import axios from "axios";

const TodoList = () => {
    // State to store the list of todos and the new todo input
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [error, setError] = useState(null);

    // Fetch todos from Django API
    const fetchTodos = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/todos/");
            setTodos(response.data);
            setError(null); // Clear any previous errors
        } catch (err) {
            console.error("Error fetching todos:", err);
            setError("Network Error: Unable to fetch todos.");
        }
    };

    // Add a new todo
    const addTodo = async () => {
        if (newTodo.trim() === "") {
            alert("Please enter a valid todo item.");
            return;
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/todos/", {
                title: newTodo,
                completed: false,
            });
            setNewTodo(""); // Clear input after adding
            fetchTodos(); // Refresh the todo list
            setError(null); // Clear any previous errors
        } catch (err) {
            console.error("Error adding todo:", err);
            setError("Network Error: Unable to add a new todo.");
        }
    };

    // Toggle the completion status of a todo
    const toggleTodo = async (id, completed) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/todos/${id}/`, {
                completed: !completed,
            });
            fetchTodos(); // Refresh the todo list
            setError(null); // Clear any previous errors
        } catch (err) {
            console.error("Error updating todo:", err);
            setError("Network Error: Unable to update todo status.");
        }
    };

    // Delete a todo
    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/todos/${id}/`);
            fetchTodos(); // Refresh the todo list
            setError(null); // Clear any previous errors
        } catch (err) {
            console.error("Error deleting todo:", err);
            setError("Network Error: Unable to delete todo.");
        }
    };

    // Fetch todos when the component mounts
    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h1>To-Do List</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    value={newTodo}
                    placeholder="Add a new todo"
                    onChange={(e) => setNewTodo(e.target.value)}
                    style={{ padding: "10px", width: "80%" }}
                />
                <button onClick={addTodo} style={{ padding: "10px", marginLeft: "10px" }}>
                    Add
                </button>
            </div>

            <ul style={{ listStyleType: "none", padding: 0 }}>
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px",
                            borderBottom: "1px solid #ccc",
                        }}
                    >
                        <span
                            onClick={() => toggleTodo(todo.id, todo.completed)}
                            style={{
                                textDecoration: todo.completed ? "line-through" : "none",
                                cursor: "pointer",
                            }}
                        >
                            {todo.title}
                        </span>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            style={{ marginLeft: "10px", padding: "5px 10px" }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
