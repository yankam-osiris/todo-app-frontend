import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onComplete, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="text-center text-green-400 py-12">
        <div className="animate-pulse">Loading tasks...</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center text-zinc-500 py-12">
        <p className="text-lg">No tasks yet. Create your first task above!</p>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.completed);
  const activeTasks = tasks.filter(t => !t.completed);

  return (
    <div className="space-y-6">
      {activeTasks.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-green-400 mb-3">
            Active Tasks ({activeTasks.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeTasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-green-400/70 mb-3">
            Completed Tasks ({completedTasks.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {completedTasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;