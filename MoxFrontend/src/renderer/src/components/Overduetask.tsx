import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface OverdueTasksChartProps {
  overdueTasks: { task: string; dueDate: string }[]
  allTasks: { id: number; title?: string; name?: string }[]
}

const COLORS = ['#ef4444', '#1E3A8A'] // Red, Blue

const OverdueTasksChart: React.FC<OverdueTasksChartProps> = ({
  overdueTasks,
  allTasks
}) => {
  const overdueCount = overdueTasks.length
  const totalCount = allTasks.length
  const otherCount = Math.max(totalCount - overdueCount, 0)

  const chartData = [
    { name: 'Overdue Tasks', value: overdueCount },
    { name: 'Other Tasks', value: otherCount }
  ]

  const hasData = chartData.some((d) => d.value > 0)

  return (
    <div className="bg-white p-4 shadow rounded h-[350px]">
      <h3 className="text-xl font-semibold mb-4">Tasks Overview</h3>
      {hasData ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${value}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500 mt-16">No task data available.</p>
      )}
    </div>
  )
}

export default OverdueTasksChart
