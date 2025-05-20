import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const STATUS_COLORS = {
  'Not Started': '#fbbf24',
  'In Progress': '#60a5fa',
  'Completed': '#4ade80',
  'Blocked': '#f87171'
};

const TaskStatusChart: React.FC<{ data: { status: string, value: number }[] }> = ({ data }) => (
  <PieChart width={400} height={300}>
    <Pie
      data={data}
      dataKey="value"
      nameKey="status"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    >
      {data.map((entry, idx) => (
        <Cell key={`cell-${idx}`} fill={STATUS_COLORS[entry.status] || '#8884d8'} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
);

export default TaskStatusChart;