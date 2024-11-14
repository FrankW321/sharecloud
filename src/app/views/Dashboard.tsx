"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import QuarterTable from "../components/QuarterTable";
import TaskForm from "../components/TaskForm";
import Navigation from "../components/Navigation";
import { getQuarterDates } from "../utils/dateUtils";
import { Task } from "../types";

const MAX_TASKS = 10;

const Dashboard: React.FC = () => {
  const [currentQuarter, setCurrentQuarter] = useState(dayjs());
  const [tasks, setTasks] = useState<Task[]>([]);

  const quarterData = getQuarterDates(currentQuarter);

  const addTask = (task: Task) => {
    if (tasks.length < MAX_TASKS) {
      setTasks((prevTasks) => [...prevTasks, { ...task, id: prevTasks.length + 1 }]);
    }
  };

  const nextQuarter = () => setCurrentQuarter(currentQuarter.add(3, "month"));
  const prevQuarter = () => setCurrentQuarter(currentQuarter.subtract(3, "month"));

  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const deleteTask = (taskToDelete: Task) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDelete.id));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-10 mx-10">
      <div className="w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Quarter {quarterData.quarter}, {currentQuarter.year()}
        </h1>
        <Navigation onNextQuarter={nextQuarter} onPrevQuarter={prevQuarter} />
        <QuarterTable tasks={tasks} quarterData={quarterData} onDeleteTask={deleteTask} onEditTask={updateTask} />
        <TaskForm onAddTask={addTask} taskCount={tasks.length} maxTasks={MAX_TASKS}/>
      </div>
    </div>
  );
};

export default Dashboard;
