import React, { useState } from 'react'

const CreateTask = () => {
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [priority, setPriority] = useState(1)
  const [dueDate, setDueDate] = useState('')
  const [completedAt, setCompletedAt] = useState('')

  const handleSubmit = async () => {
    const newTask = {
      title: taskTitle,
      description: taskDescription,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
      completedAt: completedAt ? new Date(completedAt).toISOString() : null,
      isEmergency: false,
      status: 0,
      // projectID: 1,
      assignedUserId: null
    }

    console.log('Task being sent to backend:', newTask)

    try {
      const response = await fetch('http://localhost:5183/api/Task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      })

      if (response.ok) {
        console.log('✅ Task created successfully')
      } else {
        const err = await response.text()
        console.error('❌ Failed to create task:', err)
      }
    } catch (error) {
      console.error('❌ Network or unexpected error:', error)
    }
  }

  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Create a New Task</h3>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Task Title</span>
        </label>
        <input
          type="text"
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Task Description</legend>
          <textarea
            placeholder="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="input input-bordered w-full h-24"
          />
          <p className="label">Optional</p>
        </fieldset>
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Due Date</span>
        </label>
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Completion Date</span>
        </label>
        <input
          type="datetime-local"
          value={completedAt}
          onChange={(e) => setCompletedAt(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Priority</span>
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          className="select select-bordered w-full"
        >
          <option value={0}>Not Started</option>
    <option value={1}>In Progress</option>
    <option value={2}>Completed</option>
        </select>
      </div>

      <button onClick={handleSubmit} className="btn btn-primary w-full">
        Create Task
      </button>
    </div>
  )
}

export default CreateTask
