import React from 'react';

const UpcomingDeadlinesChart: React.FC<{ data: { task: string, dueDate: string }[] }> = ({ data }) => (
  <div>
    <h3>Upcoming Deadlines</h3>
    <ul>
      {data.map((item, idx) => (
        <li key={idx}>
          <strong>{item.task}</strong>: {item.dueDate}
        </li>
      ))}
    </ul>
  </div>
);

export default UpcomingDeadlinesChart;