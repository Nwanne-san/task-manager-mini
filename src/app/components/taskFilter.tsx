"use client"

import type { FilterType } from "@/app/page"

interface TaskFilterProps {
  currentFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export function TaskFilter({ currentFilter, onFilterChange }: TaskFilterProps) {
  return (
    <div className="flex gap-2 mb-4">
      {(["all", "pending", "completed"] as const).map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentFilter === filter ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  )
}

