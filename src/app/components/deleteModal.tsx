"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { Task } from "@/app/page"

interface DeleteConfirmationModalProps {
  task: Task
  onClose: () => void
}

export function DeleteConfirmationModal({ task, onClose }: DeleteConfirmationModalProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${task.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete task")
    },
    onSuccess: () => {
      queryClient.setQueryData(["tasks"], (old: Task[]) => old.filter((t) => t.id !== task.id))
      toast.success("Task deleted successfully!")
      onClose()
    },
    onError: () => toast.error("Failed to delete task"),
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        <h3 className="text-lg font-medium mb-4">Are you sure you want to delete this task?</h3>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

