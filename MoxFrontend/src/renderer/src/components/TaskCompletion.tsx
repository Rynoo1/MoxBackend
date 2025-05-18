import React, { useState } from "react";
import ConfettiEffect from "./ConfettiEffect";

const TaskCompletionPage: React.FC = () => {
  const [taskCompleted, setTaskCompleted] = useState(false);

  const handleTaskCompletion = () => {
    setTaskCompleted(true);
  };

  return (
    <div>
      <h1>Task Complete!</h1>
      <button onClick={handleTaskCompletion}>Complete Task</button>

      {taskCompleted && <ConfettiEffect />}
    </div>
  );
};

export default TaskCompletionPage;
