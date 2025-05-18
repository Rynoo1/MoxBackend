import React, { useState } from "react";

const SubtaskList = ({ subtasks }) => {
  const [completed, setCompleted] = useState(subtasks.filter((sub) => sub.completed).length);

  return (
    <div>
      <h4>Subtasks</h4>
      {subtasks.map((sub, index) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={sub.completed}
            onChange={() => {
            }}
          />
          {sub.title}
        </div>
      ))}
      <p>{completed}/{subtasks.length} completed</p>
    </div>
  );
};

export default SubtaskList;
