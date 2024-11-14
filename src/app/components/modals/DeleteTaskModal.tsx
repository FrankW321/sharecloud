import React from "react";
import { Task } from "../../types/index";

export type DeleteTaskModalProps = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (task: Task) => void;
};

const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({ task, isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-xl mb-4">Confirm Delete</h2>
        <p className="mb-4 break-all">{task.name}</p>
        <div className="flex justify-between">
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => onDelete(task)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
