import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts'

const PRIORITY_COLORS: Record<string, string> = {
  Low: '#15803d', // bg-green-700
  Medium: '#a16207', // bg-yellow-700
  High: '#b91c1c', // bg-red-700
  Critical: '#7f1d1d' // bg-red-900
}

interface PriorityBreakdownChartProps {
  taskPriorities: string[]
  subTaskPriorities: string[]
}

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

const getPriorityData = (priorities: string[]) =>
  PRIORITIES.map((priority) => ({
    priority,
    count: priorities.filter((p) => p === priority).length
  }))

const PriorityBreakdownChart: React.FC<PriorityBreakdownChartProps> = ({
  taskPriorities,
  subTaskPriorities
}) => {
  const taskData = getPriorityData(taskPriorities)
  const subTaskData = getPriorityData(subTaskPriorities)

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        gap: 32,
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}
    >
      <div style={{ flex: 1, minWidth: 300 }}>
        <h3 style={{ textAlign: 'center' }}>Task Priorities</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={taskData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="priority" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Tasks">
              {taskData.map((entry, idx) => (
                <Cell key={entry.priority} fill={PRIORITY_COLORS[entry.priority]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ flex: 1, minWidth: 300 }}>
        <h3 style={{ textAlign: 'center' }}>Subtask Priorities</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subTaskData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="priority" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Subtasks">
              {subTaskData.map((entry, idx) => (
                <Cell key={entry.priority} fill={PRIORITY_COLORS[entry.priority]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PriorityBreakdownChart
