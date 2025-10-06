import React, { useState } from 'react';
import { FaTrash, FaCheckCircle, FaRegCircle, FaCalendarAlt } from 'react-icons/fa';

const TaskItem = ({ task, onComplete, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const [completing, setCompleting] = useState(false);

  const handleComplete = async () => {
    if (task.completed) return;
    setCompleting(true);
    await onComplete(task._id);
    setCompleting(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task._id);
    setDeleting(false);
  };

  const priorityColors = {
    low: 'text-green-400 border-green-500/30',
    medium: 'text-yellow-400 border-yellow-500/30',
    high: 'text-red-400 border-red-500/30'
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className={`bg-zinc-900 p-4 rounded-lg border ${task.completed ? 'border-green-500/50 opacity-70' : 'border-green-500/30'} transition-all hover:border-green-500/60`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={handleComplete}
            disabled={task.completed || completing}
            className="mt-1 text-green-400 hover:text-green-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {task.completed ? <FaCheckCircle size={24} /> : <FaRegCircle size={24} />}
          </button>

          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${task.completed ? 'text-green-300 line-through' : 'text-green-100'}`}>
              {task.title}
            </h3>
            <p className="text-zinc-400 text-sm mt-1">
              {task.description}
            </p>
            
            <div className="flex items-center gap-4 mt-3 text-xs">
              <span className={`px-2 py-1 rounded border ${priorityColors[task.priority]} font-medium uppercase`}>
                {task.priority}
              </span>
              
              {task.dueDate && (
                <span className="text-zinc-500 flex items-center gap-1">
                  <FaCalendarAlt size={14} />
                  {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-400 hover:text-red-300 transition disabled:opacity-50"
        >
          <FaTrash size={20} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;