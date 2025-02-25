"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface Task {
  id: number
  title: string
  completed: boolean
  userId: number
}

export function TaskItem({ task }: { task: Task }) {
  const queryClient = useQueryClient()

  const toggleMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...task,
          completed: !task.completed,
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to update task")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.setQueryData(["tasks"], (old: Task[]) =>
        old.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)),
      )
      toast.success("Task updated successfully!")
    },
    onError: () => {
      toast.error("Failed to update task")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${task.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete task")
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["tasks"], (old: Task[]) => old.filter((t) => t.id !== task.id))
      toast.success("Task deleted successfully!")
    },
    onError: () => {
      toast.error("Failed to delete task")
    },
  })

  return (
    <div
      className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg 
      hover:border-blue-200 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center space-x-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleMutation.mutate()}
            disabled={toggleMutation.isPending}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 
              focus:ring-blue-500 cursor-pointer transition-colors"
          />
        </label>
        <span
          className={`${
            task.completed ? "line-through text-gray-400" : "text-gray-700"
          } transition-colors duration-200`}
        >
          {task.title}
        </span>
      </div>
      <button
        onClick={() => deleteMutation.mutate()}
        disabled={deleteMutation.isPending}
        className="p-2 text-gray-400 hover:text-red-500 focus:outline-none 
          disabled:opacity-50 transition-colors duration-200
          opacity-0 group-hover:opacity-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

