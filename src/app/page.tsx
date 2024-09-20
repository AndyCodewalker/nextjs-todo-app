"use client"

import { useState, useEffect } from 'react';

interface Todo {
    _id?: string;
    title: string;
    completed: boolean;
    priority: number;
}

const Home = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<string>('');
    const [newPriority, setNewPriority] = useState<number>(0);
    const apiUrl = 'https://crudcrud.com/api/f9d76df4cd7c493a892efd68015fe275/todos';

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const response = await fetch(apiUrl);
        const data: Todo[] = await response.json();
        setTodos(data);
    };

    const addTodo = async () => {
        if (newTodo.length > 30) {
            alert('Title must be 30 characters or less.');
            return;
        }
        if (newPriority < 0 || newPriority > 6) {
            alert('Priority must be between 0 and 6.');
            return;
        }
        const todo: Todo = { title: newTodo, completed: false, priority: newPriority };
        await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo),
        });
        setNewTodo('');
        setNewPriority(0);
        fetchTodos();
    };

    const deleteTodo = async (id: string) => {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        });
        fetchTodos();
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">TODO List</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="border p-2 mr-2"
                    placeholder="Add new TODO"
                />
                <input
                    type="number"
                    value={newPriority}
                    onChange={(e) => setNewPriority(Number(e.target.value))}
                    className="border p-2 mr-2"
                    placeholder="Priority (0-6)"
                />
                <button onClick={addTodo} className="bg-blue-500 text-white p-2 rounded">Add</button>
            </div>
            <ul className="space-y-2">
                {todos.map((todo) => (
                    <li key={todo._id} className="p-4 border rounded shadow flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold">{todo.title}</h2>
                            <p className="text-gray-600">Completed: {todo.completed ? 'Yes' : 'No'}</p>
                            <p className="text-gray-600">Priority: {todo.priority}</p>
                        </div>
                        <button
                            onClick={() => deleteTodo(todo._id!)}
                            className="bg-red-500 text-white p-2 rounded"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
