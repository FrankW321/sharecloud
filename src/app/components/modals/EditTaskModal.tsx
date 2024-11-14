import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Task } from "../../types/index";

export type EditTaskModalProps = {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
};

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, isOpen, onClose, onSave }) => {
  const [taskName, setTaskName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && task) {
      setTaskName(task.name);
      setStartDate(task.startDate.format("YYYY-MM-DD"));
      setEndDate(task.endDate.format("YYYY-MM-DD"));
      setErrors([]);
    }
  }, [task, isOpen]);

  const validate = () => {
    const validationErrors: string[] = [];

    if (!taskName) {
      validationErrors.push("Task name is required.");
    }

    if (endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
      validationErrors.push("End date cannot be earlier than the start date.");
    }

    return validationErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "taskName") {
      setTaskName(value);
    } else if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }

    const validationErrors = validate();
    setErrors(validationErrors);
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
    } else {
      if (task && taskName && dayjs(startDate).isValid() && dayjs(endDate).isValid()) {
        onSave({
          ...task,
          name: taskName,
          startDate: dayjs(startDate),
          endDate: dayjs(endDate),
        });
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-xl mb-4">Edit Task</h2>
        {errors.length > 0 && (
          <div className="text-red-500 mb-4">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700">Task Name</label>
          <input
            type="text"
            name="taskName"
            className={`w-full p-2 border rounded ${errors.some((error) => error.includes("Task name")) ? "border-red-600" : ""}`}
            value={taskName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            className={`w-full p-2 border rounded ${errors.some((error) => error.includes("Start date")) ? "border-red-600" : ""}`}
            value={startDate}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            className={`w-full p-2 border rounded ${errors.some((error) => error.includes("End date")) ? "border-red-600" : ""}`}
            value={endDate}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-between">
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded text-white ${errors.length > 0 ? "bg-red-600 hover:bg-red-700 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
            onClick={handleSave}
            disabled={errors.length > 0}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
