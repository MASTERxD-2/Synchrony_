import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  task: any;
  toggle: () => void;
}

const TaskCard: React.FC<Props> = ({ task, toggle }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm flex items-start space-x-4 bg-white hover:bg-gray-50">
      <Checkbox checked={task.completed} onCheckedChange={toggle} />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <p className="text-gray-600">{task.description}</p>
        <div className="text-sm text-gray-500 mt-1">
          Priority: <span className="capitalize">{task.priority}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
