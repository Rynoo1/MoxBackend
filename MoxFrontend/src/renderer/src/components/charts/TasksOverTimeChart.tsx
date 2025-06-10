import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

interface TasksOverTimeChartProps {
  data: { date: string; completed: number }[]
}

const TasksOverTimeChart: React.FC<TasksOverTimeChartProps> = ({ data }) => {
  console.log('TasksOverTimeChart props:', data)
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h2 className="font-bold mb-2 text-center">Tasks Completed Over Time</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="completed" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TasksOverTimeChart
