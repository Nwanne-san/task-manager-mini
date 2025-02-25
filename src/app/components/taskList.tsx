"use client"

import { useQuery } from "@tanstack/react-query"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import type { FilterType, Task, Priority } from "@/app/page"
import { toast } from "sonner"

interface TaskListProps {
  filter: FilterType
  onDeleteTask: (task: Task) => void
}

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const colors = {
    Urgent: "bg-red-100 text-red-600",
    High: "bg-orange-100 text-orange-600",
    Medium: "bg-blue-100 text-blue-600",
    Low: "bg-gray-100 text-gray-600",
  }

  return <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[priority]}`}>{priority}</span>
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "Done":
      return <CheckCircle2 className="w-5 h-5 text-green-500" />
    case "In-Progress":
      return <Clock className="w-5 h-5 text-blue-500" />
    default:
      return <Circle className="w-5 h-5 text-gray-400" />
  }
}

export function TaskList({ filter, onDeleteTask }: TaskListProps) {
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos")
      if (!response.ok) throw new Error("Failed to fetch tasks")

      // Transform the data to match our Task interface
      const data = await response.json()
      return data.map((task: any) => ({
        id: task.id,
        title: task.title,
        status: task.completed ? "Done" : "Pending",
        priority: ["Urgent", "High", "Medium", "Low"][Math.floor(Math.random() * 4)],
      }))
    },
    onError: () => toast.error("Failed to fetch tasks"),
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 w-full bg-gray-100 rounded-lg animate-pulse" />
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

  const filteredTasks = tasks?.filter((task) => {
    if (filter === "completed") return task.status === "Done"
    if (filter === "pending") return task.status !== "Done"
    return true
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-4 font-medium text-gray-600">Task</th>
            <th className="pb-4 font-medium text-gray-600">Status</th>
            <th className="pb-4 font-medium text-gray-600">Priority</th>
            <th className="pb-4 font-medium text-gray-600"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {filteredTasks?.map((task) => (
            <tr key={task.id} className="group">
              <td className="py-4">{task.title}</td>
              <td className="py-4">
                <StatusIcon status={task.status} />
              </td>
              <td className="py-4">
                <PriorityBadge priority={task.priority} />
              </td>
              <td className="py-4">
                <button
                  onClick={() => onDeleteTask(task)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredTasks?.length === 0 && <p className="text-center text-gray-500 py-8">No tasks found</p>}
    </div>
  )
}

