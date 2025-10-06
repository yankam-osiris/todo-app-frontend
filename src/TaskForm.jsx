import React, { useState } from 'react';
import { FaPlus, FaExclamationCircle, FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskForm = ({ onTaskAdded }) => {
  const API_URL = 'https://todo-app-backend-tq2k.onrender.com/api';
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'low',
    dueDate: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        dueDate: formData.dueDate ? formData.dueDate.toISOString() : null
      };

      const response = await fetch(`${API_URL}/addtask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (data.success) {
        setFormData({ title: '', description: '', priority: 'low', dueDate: null });
        onTaskAdded();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-lg border border-green-500/30 mb-6">
      <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
        <FaPlus size={24} />
        Add New Task
      </h2>
      
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-3 rounded mb-4 flex items-center gap-2">
          <FaExclamationCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-green-300 mb-2 text-sm font-medium">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full bg-black border border-green-500/50 text-green-100 p-3 rounded focus:outline-none focus:border-green-400 transition"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label className="block text-green-300 mb-2 text-sm font-medium">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full bg-black border border-green-500/50 text-green-100 p-3 rounded focus:outline-none focus:border-green-400 transition resize-none"
            placeholder="Enter task description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-green-300 mb-2 text-sm font-medium">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full bg-black border border-green-500/50 text-green-100 p-3 rounded focus:outline-none focus:border-green-400 transition"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-green-300 mb-2 text-sm font-medium">Due Date</label>
            <div className="relative">
              <DatePicker
                selected={formData.dueDate}
                onChange={(date) => setFormData({ ...formData, dueDate: date })}
                dateFormat="MMM dd, yyyy"
                minDate={new Date()}
                placeholderText="Select a due date"
                className="w-full bg-black border border-green-500/50 text-green-100 p-3 rounded focus:outline-none focus:border-green-400 transition pr-10"
                wrapperClassName="w-full"
              />
              <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding Task...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;