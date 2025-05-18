import React, { useState } from "react";

const CreateTask = () => {
  const [taskTitle, setTaskTitle] = useState("");

  const handleSubmit = () => {
    console.log("Creating task:", taskTitle);

  };

  return (
    <div>
      <h1>Create New Task</h1>
      <input
        type="text"
        placeholder="Task Title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />
      <button onClick={handleSubmit}>Create Task</button>
    </div>
  );
};

export default CreateTask;
