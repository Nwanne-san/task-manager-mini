interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    totalItems: number
    itemsPerPage: number
    startIndex: number
    endIndex: number
  }
  
  export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    startIndex,
    endIndex,
  }: PaginationProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
      const pages = []
      const maxVisiblePages = 5 // Maximum number of page buttons to show
  
      if (totalPages <= maxVisiblePages) {
        // If total pages is less than max visible, show all pages
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Always show first page
        pages.push(1)
  
        // Calculate start and end of page range
        let start = Math.max(2, currentPage - 1)
        let end = Math.min(totalPages - 1, currentPage + 1)
  
        // Adjust range if at the start or end
        if (currentPage <= 2) {
          end = 4
        }
        if (currentPage >= totalPages - 1) {
          start = totalPages - 3
        }
  
        // Add ellipsis if needed
        if (start > 2) {
          pages.push('...')
        }
  
        // Add page numbers
        for (let i = start; i <= end; i++) {
          pages.push(i)
        }
  
        // Add ellipsis if needed
        if (end < totalPages - 1) {
          pages.push('...')
        }
  
        // Always show last page
        if (totalPages > 1) {
          pages.push(totalPages)
        }
      }
  
      return pages
    }
  
    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{endIndex} of {totalItems} tasks
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-200 
              hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 
              disabled:hover:border-gray-200 disabled:hover:text-inherit
              transition-colors duration-200"
          >
            Previous
          </button>
  
          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum, index) => (
              <button
                key={index}
                onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
                disabled={pageNum === '...'}
                className={`
                  min-w-[32px] h-8 flex items-center justify-center rounded-md
                  transition-colors duration-200
                  ${typeof pageNum === 'number' && pageNum === currentPage
                    ? 'bg-blue-600 text-white'
                    : typeof pageNum === 'number'
                    ? 'hover:bg-blue-50 hover:text-blue-600'
                    : ''
                  }
                  ${pageNum === '...' ? 'cursor-default' : ''}
                `}
              >
                {pageNum}
              </button>
            ))}
          </div>
  
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-200 
              hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 
              disabled:hover:border-gray-200 disabled:hover:text-inherit
              transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </div>
    )
  }
  