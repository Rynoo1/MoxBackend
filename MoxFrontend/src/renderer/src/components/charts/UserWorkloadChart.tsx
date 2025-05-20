import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const UserWorkloadChart: React.FC<{ data: { user: string, tasks: number }[] }> = ({ data }) => (
  <BarChart width={500} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="user" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="tasks" fill="#60a5fa" />
  </BarChart>
);

export default UserWorkloadChart;