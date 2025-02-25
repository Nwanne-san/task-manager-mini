"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from 'sonner'
import type { Priority } from "@/app/page"

interface AddTaskModalProps {
  onClose: () => void
}

export function AddTaskModal({ onClose }: AddTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("Low")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priority,
          startDate,
          endDate,
          status: "Pending"
        }),
      })
      if (!response.ok) throw new Error("Failed to add task")
      return response.json()
    },
    onSuccess: (newTask) => {
      queryClient.setQueryData(["tasks"], (old: unknown[]) => [newTask, ...old])
      toast.success('Task added successfully!')
      onClose()
    },
    onError: () => toast.error('Failed to add task')
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    mutation.mutate()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-6">Create New task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task info
            </label>
            <input
              type="text"
              placeholder="Add a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <textarea
              placeholder="Write a short bio"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="space-y-2">
              {(["Low", "Medium", "High", "Urgent"] as const).map((p) => (
                <label key={p} className="flex items-center">
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={priority === p}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Set Timeline
            </label>
            <div className="space-y-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !title.trim()}
              className="px-4 py-2 bg-[#4318FF] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Create task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
