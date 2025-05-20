import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#4ade80', '#fbbf24', '#f87171', '#a78bfa'];

const ProjectCompletionChart: React.FC<{ data: { name: string, completion: number }[] }> = ({ data }) => (
  <PieChart width={400} height={300}>
    <Pie
      data={data}
      dataKey="completion"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    >
      {data.map((_entry, idx) => (
        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
);

export default ProjectCompletionChart;