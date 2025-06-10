import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const STATUS_COLORS: Record<string, string> = {
  'Not Started': '#fbbf24',
  'In Progress': '#60a5fa',
  Completed: '#4ade80',
  Blocked: '#f87171',
  Unknown: '#a1a1aa'
}

interface TaskStatusChartProps {
  data: { status: string; count: number }[]
}

const TaskStatusChart: React.FC<TaskStatusChartProps> = ({ data }) => {
  // Convert data to recharts format: { name: string, value: number }
  const chartData = data.map((d) => ({
    name: d.status,
    value: d.count,
    status: d.status
  }))

  if (!chartData || chartData.length === 0) {
    return (
      <div>
        <h3>Task Status Distribution</h3>
        <p className="text-gray-500 italic">No data available.</p>
      </div>
    )
  }

  return (
    console.log('TaskStatusChart props:', data),
    (
      <div>
        <h3 className="font-bold mb-2 text-center">Task Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={STATUS_COLORS[entry.status] || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  )
}

export default TaskStatusChart
