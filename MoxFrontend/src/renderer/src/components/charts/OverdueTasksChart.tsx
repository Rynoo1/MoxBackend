import React from 'react';

const OverdueTasksChart: React.FC<{ data: { task: string, dueDate: string }[] }> = ({ data }) => (
  <div>
    <h3>Overdue Tasks ({data.length})</h3>
    <ul>
      {data.map((item, idx) => (
        <li key={idx}>
          <strong>{item.task}</strong> (Due: {item.dueDate})
        </li>
      ))}
    </ul>
  </div>
);

export default OverdueTasksChart;