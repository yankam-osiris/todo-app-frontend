import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const App = () => {
  const API_URL = 'https://todo-app-backend-tq2k.onrender.com/api';
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskAdded = () => {
    fetchTasks();
    setShowForm(false);
  };

  const handleComplete = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/updateStatus/${taskId}`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/deleteTask/${taskId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-100">
      <div className="max-w-4xl mx-auto p-6">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-green-400 mb-2">
            Todo App
          </h1>
          <p className="text-zinc-400">Manage your tasks efficiently</p>
        </header>

        {!showForm ? (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-4 rounded transition flex items-center justify-center gap-2"
            >
              <FaPlus size={20} />
              Add Task
            </button>
          </div>
        ) : (
          <TaskForm onTaskAdded={handleTaskAdded} />
        )}

        <TaskList
          tasks={tasks}
          onComplete={handleComplete}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default App;