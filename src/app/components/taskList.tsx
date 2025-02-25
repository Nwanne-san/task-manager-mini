"use client"

import { useQuery } from "@tanstack/react-query"
import { TaskItem } from "./taskItem"
import { Pagination } from "./pagination"
import type { FilterType } from "@/app/page"
import { toast } from 'sonner'
import { useState } from "react"

interface Task {
  id: number
  title: string
  completed: boolean
  userId: number
}

export function TaskList({ filter }: { filter: FilterType }) {
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const {
    data: allTasks,
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos")
      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }
      return response.json()
    },
    onError: () => {
      toast.error('Failed to fetch tasks')
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 w-full bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Failed to load tasks. Please try again later.
      </div>
    )
  }

  // Filter tasks based on the selected filter
  const filteredTasks = allTasks?.filter((task) => {
    if (filter === "completed") return task.completed
    if (filter === "pending") return !task.completed
    return true
  }) || []

  // Calculate pagination
  const totalItems = filteredTasks.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTasks = filteredTasks.slice(startIndex, endIndex)

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {currentTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
        {currentTasks.length === 0 && (
          <p className="text-center text-gray-500 py-8">No tasks found</p>
        )}
      </div>
      
      {totalItems > 0 && (
        <div className="border-t pt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            startIndex={startIndex}
            endIndex={Math.min(endIndex, totalItems)}
          />
        </div>
      )}
    </div>
  )
}
