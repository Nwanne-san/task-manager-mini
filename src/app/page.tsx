"use client"

import { TaskList } from "./components/taskList"
import { AddTaskForm } from "./components/add-task"
import { TaskFilter } from "./components/taskFilter"
import { useState } from "react"

export type FilterType = "all" | "pending" | "completed"

export default function Home() {
  const [filter, setFilter] = useState<FilterType>("all")

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Task Manager</h1>
            <AddTaskForm />
            <TaskFilter currentFilter={filter} onFilterChange={setFilter} />
            <TaskList filter={filter} />
          </div>
        </div>
      </div>
    </main>
  )
}

