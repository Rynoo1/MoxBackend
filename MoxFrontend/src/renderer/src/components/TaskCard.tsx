import React from "react";

const TaskCard = ({ task, onDrag }) => {
  const handleDragEnd = (e) => {

    onDrag(task.id, "New Status");
  };

  return (
    <div
      className="task-card"
      draggable
      onDragEnd={handleDragEnd}
    >
      <h3>{task.title}</h3>

    </div>
  );
};

export default TaskCard;
