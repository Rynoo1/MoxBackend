import React from "react";
import { useParams } from "react-router-dom";

const TaskDetails = () => {
  const { taskId } = useParams();
  return (
    <div>
      <h1>Task Details for Task ID: {taskId}</h1>

    </div>
  );
};

export default TaskDetails;
