import React, { useState, useEffect } from "react";
import "../components/styles/Projects.css";

type User = { id: number; name: string };
type Subtask = {
    name: string;
    description: string;
    users: User[];
};
type Task = {
    name: string;
    description: string;
    dueDate: string;
    priority: string;
    subtasks: Subtask[];
};

const CreateProject: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [projectName, setProjectName] = useState("");
    const [projectDueDate, setProjectDueDate] = useState("");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showTaskForm, setShowTaskForm] = useState(false);

    // Task form state
    const [taskForm, setTaskForm] = useState({
        name: "",
        description: "",
        dueDate: "",
        priority: "",
        subtasks: [] as Subtask[],
    });
    const [showSubtaskForm, setShowSubtaskForm] = useState(false);

    // Subtask form state
    const [subtaskForm, setSubtaskForm] = useState({
        name: "",
        description: "",
        users: [] as User[],
    });

    // Fetch users from backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:5183/api/User");
                if (!response.ok) throw new Error("Failed to fetch users");
                const data = await response.json();
                const usersArray = Array.isArray(data.$values) ? data.$values : Array.isArray(data) ? data : [];
                setUsers(usersArray);
            } catch (err) {
                setUsers([]);
            }
        };
        fetchUsers();
    }, []);

    // Handlers for project
    const handleAddTask = () => setShowTaskForm(true);

    const handleTaskFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
    };

    const handleAddTaskToList = () => {
        setTasks([...tasks, { ...taskForm, subtasks: [...taskForm.subtasks] }]);
        setTaskForm({
            name: "",
            description: "",
            dueDate: "",
            priority: "",
            subtasks: [],
        });
        setShowTaskForm(false);
    };

    // Handlers for subtask
    const handleAddSubtask = () => setShowSubtaskForm(true);

    const handleSubtaskFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setSubtaskForm({ ...subtaskForm, [e.target.name]: e.target.value });
    };

    const handleUserSelect = (userId: number) => {
        const user = users.find((u) => u.id === userId);
        if (!user) return;
        if (!subtaskForm.users.some((u) => u.id === userId)) {
            setSubtaskForm({ ...subtaskForm, users: [...subtaskForm.users, user] });
        }
    };

    const handleRemoveUser = (userId: number) => {
        setSubtaskForm({
            ...subtaskForm,
            users: subtaskForm.users.filter((u) => u.id !== userId),
        });
    };

    const handleAddSubtaskToTask = () => {
        setTaskForm({
            ...taskForm,
            subtasks: [...taskForm.subtasks, { ...subtaskForm }],
        });
        setSubtaskForm({ name: "", description: "", users: [] });
        setShowSubtaskForm(false);
    };

    // Submit handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const project = {
            name: projectName,
            dueDate: projectDueDate,
            tasks,
        };
        // Submit project to backend here
        alert("Project submitted!\n" + JSON.stringify(project, null, 2));
        // Reset all
        setProjectName("");
        setProjectDueDate("");
        setTasks([]);
    };

    return (
        <div className="createprojectcontainer">
            
                <h2>Create Project</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Project Name:
                            <input
                                name="projectName"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Project Due Date:
                            <input
                                type="date"
                                name="projectDueDate"
                                value={projectDueDate}
                                onChange={(e) => setProjectDueDate(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                
                <div style={{ marginTop: 16 }}>
                    <h3>Tasks</h3>
                    {tasks.map((task, idx) => (
                        <div key={idx} style={{ border: "1px solid #ccc", marginBottom: 8, padding: 8 }}>
                            <strong>{task.name}</strong> (Due: {task.dueDate}, Priority: {task.priority})
                            <div>{task.description}</div>
                            <div>
                                <em>Subtasks:</em>
                                <ul>
                                    {task.subtasks.map((sub, sidx) => (
                                        <li key={sidx}>
                                            <strong>{sub.name}</strong>: {sub.description} <br />
                                            Users: {sub.users.map((u) => u.name).join(", ")}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                    {!showTaskForm && (
                        <button type="button" onClick={handleAddTask}>
                            Add Task
                        </button>
                    )}
                    {showTaskForm && (
                        <div style={{ border: "1px solid #aaa", padding: 8, marginTop: 8 }}>
                            <div>
                                <label>
                                    Task Name:
                                    <input
                                        name="name"
                                        value={taskForm.name}
                                        onChange={handleTaskFormChange}
                                        required
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Task Description:
                                    <textarea
                                        name="description"
                                        value={taskForm.description}
                                        onChange={handleTaskFormChange}
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Task Due Date:
                                    <input
                                        type="date"
                                        name="dueDate"
                                        value={taskForm.dueDate}
                                        onChange={handleTaskFormChange}
                                        required
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Priority:
                                    <select
                                        name="priority"
                                        value={taskForm.priority}
                                        onChange={handleTaskFormChange}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="Low">Low</option>
                                        <option value="Normal">Normal</option>
                                        <option value="High">High</option>
                                    </select>
                                </label>
                            </div>
                            <div style={{ marginTop: 8 }}>
                                <h4>Subtasks</h4>
                                <ul>
                                    {taskForm.subtasks.map((sub, sidx) => (
                                        <li key={sidx}>
                                            <strong>{sub.name}</strong>: {sub.description} <br />
                                            Users: {sub.users.map((u) => u.name).join(", ")}
                                        </li>
                                    ))}
                                </ul>
                                {!showSubtaskForm && (
                                    <button type="button" onClick={handleAddSubtask}>
                                        Add Subtask
                                    </button>
                                )}
                                {showSubtaskForm && (
                                    <div style={{ border: "1px solid #bbb", padding: 8, marginTop: 8 }}>
                                        <div>
                                            <label>
                                                Subtask Name:
                                                <input
                                                    name="name"
                                                    value={subtaskForm.name}
                                                    onChange={handleSubtaskFormChange}
                                                    required
                                                />
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                Subtask Description:
                                                <textarea
                                                    name="description"
                                                    value={subtaskForm.description}
                                                    onChange={handleSubtaskFormChange}
                                                />
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                Add Users:
                                                <select
                                                    onChange={(e) => handleUserSelect(Number(e.target.value))}
                                                    value=""
                                                >
                                                    <option value="">Select user</option>
                                                    {users.map((user) => (
                                                        <option key={user.id} value={user.id}>
                                                            {user.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                            <div>
                                                {subtaskForm.users.map((user) => (
                                                    <span key={user.id} style={{ marginRight: 8 }}>
                                                        {user.name}{" "}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveUser(user.id)}
                                                            style={{ color: "red" }}
                                                        >
                                                            x
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <button type="button" onClick={handleAddSubtaskToTask}>
                                            Save Subtask
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button type="button" onClick={handleAddTaskToList} style={{ marginTop: 8 }}>
                                Save Task
                            </button>
                        </div>
                    )}
                </div>
                <button type="submit" style={{ marginTop: 16 }}>
                    Submit Project
                </button>
            </form>
        </div>
    );
};

export default CreateProject;