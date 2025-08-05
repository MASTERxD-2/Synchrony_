// src/components/TaskCard.tsx
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface TaskProps {
  task: {
    id: string;
    title: string;
    description: string;
    category: string;
    completed: boolean;
    priority: string;
    dueDate?: string;
  };
  toggle: () => void;
}

const TaskCard: React.FC<TaskProps> = ({ task, toggle }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-start space-x-4 border">
      <Checkbox checked={task.completed} onCheckedChange={toggle} />
      <div>
        <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h3>
        <p className="text-sm text-gray-600">{task.description}</p>
        <p className="text-xs mt-1 text-gray-500">
          Category: {task.category} | Priority: {task.priority}
        </p>
        {task.dueDate && (
          <p className="text-xs text-orange-600">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
