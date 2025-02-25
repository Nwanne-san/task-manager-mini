"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface Task {
  id: number
  title: string
  completed: boolean
  userId: number
}

export function AddTaskForm() {
  const [title, setTitle] = useState("")
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          completed: false,
          userId: 1,
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to add task")
      }
      return response.json()
    },
    onSuccess: (newTask) => {
      queryClient.setQueryData(["tasks"], (old: Task[]) => [newTask, ...old])
      setTitle("")
      toast.success("Task added successfully!")
    },
    onError: () => {
      toast.error("Failed to add task")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    mutation.mutate()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
      <input
        type="text"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={mutation.isPending}
        className="flex-1 px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          placeholder:text-gray-400"
      />
      <button
        type="submit"
        disabled={mutation.isPending || !title.trim()}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
          focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200 shadow-lg shadow-blue-500/30
          active:transform active:scale-95"
      >
        Add Task
      </button>
    </form>
  )
}

