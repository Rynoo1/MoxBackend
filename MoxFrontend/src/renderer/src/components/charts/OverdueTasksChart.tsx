import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface OverdueTasksChartProps {
  overdueTasks: { task: string; dueDate: string }[]
  allTasks: any[]
}

const COLORS = ['#ef4444', '#3b82f6']

const OverdueTasksChart: React.FC<OverdueTasksChartProps> = ({ overdueTasks, allTasks }) => {
  const overdueCount = overdueTasks.length
  const totalCount = allTasks.length
  const notOverdueCount = Math.max(totalCount - overdueCount, 0)

  const data = [
    { name: 'Overdue Tasks', value: overdueCount },
    { name: 'Other Tasks', value: notOverdueCount }
  ]

  return (
    <div style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
      <h3 className="text-center mb-2">Overdue Tasks Pie Chart</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <span className="font-semibold text-red-600">{overdueCount}</span> overdue out of{' '}
        <span className="font-semibold">{totalCount}</span> total tasks
      </div>
    </div>
  )
}

export default OverdueTasksChart
