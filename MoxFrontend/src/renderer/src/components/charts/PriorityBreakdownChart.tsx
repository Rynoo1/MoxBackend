import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const PRIORITY_COLORS = {
  High: '#f87171',
  Medium: '#fbbf24',
  Low: '#4ade80'
};

const PriorityBreakdownChart: React.FC<{ data: { priority: string, value: number }[] }> = ({ data }) => (
  <PieChart width={400} height={300}>
    <Pie
      data={data}
      dataKey="value"
      nameKey="priority"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    >
      {data.map((entry, idx) => (
        <Cell key={`cell-${idx}`} fill={PRIORITY_COLORS[entry.priority] || '#8884d8'} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
);

export default PriorityBreakdownChart;