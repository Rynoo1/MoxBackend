import React, { useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface UserWorkloadChartProps {
  data: { user: string; taskCount: number }[]
}

const UserWorkloadChart: React.FC<UserWorkloadChartProps> = ({ data }) => {
  useEffect(() => {
    console.log('UserWorkloadChart props:', data)
  }, [data])

  return (
    <div style={{ width: '100%', maxWidth: 700, margin: '0 auto' }}>
      <h3 className="text-center mb-2">User Workload (Subtasks Assigned)</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="user" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="taskCount" fill="#60a5fa" name="Subtasks Assigned" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default UserWorkloadChart
