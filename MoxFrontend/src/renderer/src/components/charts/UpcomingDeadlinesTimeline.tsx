import React from 'react'

interface TimelineItem {
  name: string
  daysUntilDue: number
  dueDate: string
  project: string
}

interface UpcomingDeadlinesTimelineProps {
  data: TimelineItem[]
}

const UpcomingDeadlinesTimeline: React.FC<UpcomingDeadlinesTimelineProps> = ({ data }) => {
  // Sort by due date ascending
  const sorted = [...data].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )

  return (
    <div className="w-full justify-center py-8 bg-blue-500">
      <div className="w-full max-w-7xl px-2 sm:px-4">
        <ul
          className="
          timeline 
          timeline-horizontal 
          sm:timeline-vertical 
          w-full
          py-8
          bg-base-200 
          rounded-xl 
          shadow-lg
          overflow-x-auto
        "
          style={{ minHeight: 250 }}
        >
          {sorted.map((item, idx) => (
            <li key={item.name + item.dueDate} className="min-w-[220px] sm:min-w-0">
              {idx !== 0 && <hr className="bg-base-300" />}
              <div
                className="timeline-middle group"
                title={`${item.name}\nDue: ${new Date(item.dueDate).toLocaleDateString()}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill={item.daysUntilDue === 0 ? '#059669' : '#dc2626'}
                  className={`h-10 w-10 transition-transform group-hover:scale-125 drop-shadow-lg ${
                    item.daysUntilDue === 0 ? 'ring-4 ring-green-800' : ''
                  }`}
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="9"
                    fill={item.daysUntilDue === 0 ? '#059669' : '#dc2626'}
                  />
                  <circle cx="10" cy="10" r="5" fill="#fff" />
                </svg>
              </div>
              <div className="timeline-end timeline-box shadow-xl bg-white border border-base-300 mt-2">
                <div className="font-bold text-base text-center break-words">{item.name}</div>
                <div className="text-xs opacity-70 text-center">
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default UpcomingDeadlinesTimeline
