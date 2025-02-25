"use client"

import { TaskList } from "./components/taskList"
import { AddTaskModal } from "./components/taskModal"
import { useState } from "react"
import { DeleteConfirmationModal } from "./components/deleteModal"

export type Priority = "Urgent" | "High" | "Medium" | "Low"
export type Status = "Done" | "In-Progress" | "Pending"
export type FilterType = "all" | "pending" | "completed"

export interface Task {
  id: number
  title: string
  description?: string
  status: Status
  priority: Priority
  startDate?: string
  endDate?: string
}

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [filter, setFilter] = useState<FilterType>("all")

  return (
    <main className="min-h-screen bg-[#f8f8f8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#4318FF] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add new task
            </button>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <TaskList 
            filter={filter}
            onDeleteTask={setTaskToDelete}
          />
        </div>
      </div>

      {isAddModalOpen && (
        <AddTaskModal
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {taskToDelete && (
        <DeleteConfirmationModal
          task={taskToDelete}
          onClose={() => setTaskToDelete(null)}
        />
      )}
    </main>
  )
}
