"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import EditTaskModal from "../components/modals/EditTaskModal";
import DeleteTaskModal from "../components/modals/DeleteTaskModal";
import { generateWeeksInQuarter, groupWeeksByMonth } from "../utils/dateUtils";
import { Task, QuarterData } from "../types/index";

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

export type QuarterTableProps = {
  tasks: Task[];
  quarterData: QuarterData;
  onEditTask: (updatedTask: Task) => void;
  onDeleteTask: (taskToDelete: Task) => void;
};

const QuarterTable: React.FC<QuarterTableProps> = ({ tasks, quarterData, onEditTask, onDeleteTask }) => {
  const { startOfQuarter, endOfQuarter } = quarterData;
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const currentWeek = dayjs().isoWeek();
  const weeks = generateWeeksInQuarter(startOfQuarter, endOfQuarter);
  const weeksByMonth = groupWeeksByMonth(startOfQuarter, weeks);

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveClick = (updatedTask: Task) => {
    onEditTask({ ...selectedTask!, ...updatedTask });
    closeModal();
  };

  const handleDeleteConfirm = () => {
    if (selectedTask) {
      onDeleteTask(selectedTask);
      closeModal();
    }
  };

  const isTaskPast = (task: Task) => dayjs().isAfter(task.endDate, "day");

  return (
    <div className="overflow-x-auto mt-6">
      <table className="table-auto min-w-full border-collapse">
        <thead>
          <tr className="text-center">
            <th className="px-4 py-2 text-gray-600 w-1/12">Task name</th>
            <th className="px-4 py-2 text-gray-600 w-1/12">Start date</th>
            <th className="px-4 py-2 text-gray-600 w-1/12">End date</th>
            <th className="px-4 py-2 text-gray-600 w-1/12">Actions</th>

            {weeksByMonth.map((monthGroup, monthIdx) => (
              <th
                key={`${monthGroup.monthName}-${monthIdx}`}
                colSpan={monthGroup.weeks.length}
                className="px-4 py-2 text-gray-600 bg-blue-200 border-l border-r border-black"
              >
                {monthGroup.monthName}
              </th>
            ))}
          </tr>
          <tr>
            <th colSpan={4}></th>
            {weeksByMonth.map((monthGroup, monthIdx) =>
              monthGroup.weeks.map((week, weekIdx) => (
                <th
                  key={`week-${week}-${monthIdx}-${weekIdx}`}
                  className="px-4 py-2 text-gray-600 w-12 border-l border-r"
                >
                  <div className="flex flex-col items-center">
                    <span>Week</span>
                    <span>{week}</span>
                  </div>
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, idx) => (
            <tr key={idx} className="border-t hover:bg-gray-100 text-center">
              <td className="px-4 py-2 truncate" title={task.name}>
                {task.name.length > 15 ? `${task.name.substring(0, 15)}...` : task.name}
              </td>
              <td className="px-4 py-2">{task.startDate.format("DD.MM.YYYY")}</td>
              <td className="px-4 py-2">{task.endDate.format("DD.MM.YYYY")}</td>
              <td className="px-4 py-2 text-center">
                <button onClick={() => openEditModal(task)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2 mb-2 w-full">
                  Edit
                </button>
                <button onClick={() => openDeleteModal(task)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 w-full">
                  Delete
                </button>
              </td>
              {weeksByMonth.flatMap((monthGroup) =>
                monthGroup.weeks.map((week) => {
                  const isInWeek = 
                    task.startDate.year() === quarterData.year &&
                    week >= task.startDate.isoWeek() && 
                    week <= task.endDate.isoWeek();
                    
                  const isCurrentWeek = 
                    dayjs().year() === quarterData.year && 
                    week === currentWeek;

                  return (
                    <td
                      key={`${task.id}-${week}`}
                      className={`px-4 py-2 relative ${isInWeek ? "bg-purple-200" : ""} 
                        ${isTaskPast(task) && isInWeek ? "bg-gray-200" : ""} 
                        ${isCurrentWeek ? "border-l border-r border-indigo-600" : ""}`}
                    >
                      {isCurrentWeek && (
                        <div className="text-indigo-600 text-xs px-2 py-1 text-center">
                          Present
                        </div>
                      )}
                    </td>
                  );
                })
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <EditTaskModal task={selectedTask!} isOpen={isEditModalOpen && selectedTask !== null} onClose={closeModal} onSave={handleSaveClick} />
      <DeleteTaskModal task={selectedTask!} isOpen={isDeleteModalOpen && selectedTask !== null} onClose={closeModal} onDelete={handleDeleteConfirm} />
    </div>
  );
};

export default QuarterTable;
