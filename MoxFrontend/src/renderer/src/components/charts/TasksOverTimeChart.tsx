import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TasksOverTimeChart: React.FC<{ data: { date: string, completed: number }[] }> = ({ data }) => (
  <LineChart width={500} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="completed" stroke="#4ade80" />
  </LineChart>
);

export default TasksOverTimeChart;