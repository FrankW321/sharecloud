"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import { Task } from "../types";

type TaskFormProps = {
  onAddTask: (task: Task) => void;
  taskCount: number;
  maxTasks: number;
};

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, taskCount, maxTasks }) => {
  const [id, setId] = useState(1);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors: string[] = [];

    if (!name) {
      validationErrors.push("Task name is required.");
    }

    if (taskCount >= maxTasks) {
      validationErrors.push(`You can't add more than ${maxTasks} tasks.`);
    }

    if (endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
      validationErrors.push("End date cannot be earlier than the start date.");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (startDate && endDate) {
      onAddTask({
        id,
        name,
        startDate: dayjs(startDate),
        endDate: dayjs(endDate),
      });
      setId(id + 1);
      setName("");
      setStartDate("");
      setEndDate("");
    }
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Task</h3>
      <form onSubmit={handleSubmit}>
        {errors.length > 0 && (
          <div className="text-red-500 mb-4">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <div className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Task name"
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
              errors.some((error) => error.includes("Task name")) ? "border-red-600" : ""
            }`}
          />
        </div>

        <div className="mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
              errors.some((error) => error.includes("Start date")) ? "border-red-600" : ""
            }`}
          />
        </div>

        <div className="mb-6">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
              errors.some((error) => error.includes("End date")) ? "border-red-600" : ""
            }`}
          />
        </div>

        <button
          type="submit"
          className={`w-full px-4 py-2 font-medium rounded-md shadow-md focus:outline-none 
            ${errors.length > 0 || taskCount >= maxTasks ? "bg-red-600 text-white hover:bg-red-700 cursor-default" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          disabled={taskCount >= maxTasks}
        >
          {taskCount >= maxTasks ? `Task Limit of ${maxTasks} Reached` : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
