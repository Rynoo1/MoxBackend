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

    
    const [taskForm, setTaskForm] = useState({
        name: "",
        description: "",
        dueDate: "",
        priority: "",
        subtasks: [] as Subtask[],
    });
    const [showSubtaskForm, setShowSubtaskForm] = useState(false);

    
    const [subtaskForm, setSubtaskForm] = useState({
        name: "",
        description: "",
        users: [] as User[],
    });

    
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

    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const project = {
            name: projectName,
            dueDate: projectDueDate,
            tasks,
        };
        
        alert("Project submitted!\n" + JSON.stringify(project, null, 2));
        
        setProjectName("");
        setProjectDueDate("");
        setTasks([]);
    };

    return (
        <div className="createprojectcontainer flex flex-col p-6 min-h-screen h-screen overflow-y-auto">
            <h1 className="mb-6">Create Project</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                <div className="flex flex-col gap-4">
                    <label className="projectnameinput">
                        Project Name:
                        <input
                            name="projectName"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                            className="input input-bordered w-full"
                        />
                    </label>
                    <label>
                        Project Due Date:
                        <input
                            type="date"
                            name="projectDueDate"
                            value={projectDueDate}
                            onChange={(e) => setProjectDueDate(e.target.value)}
                            required
                            className="input input-bordered w-full"
                        />
                    </label>
                    
                </div>
                <div className="flex flex-col gap-4">
                    <h3>Tasks</h3>
                    {tasks.map((task, idx) => (
                        <div key={idx} className="border border-gray-300 rounded p-3 mb-2">
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
                        <button
                            type="button"
                            onClick={handleAddTask}
                            className="btn btn-secondary w-full md:w-auto create-project-from-button-secondary"
                        >
                            Add Task
                        </button>
                    )}
                    
                    {showTaskForm && (
                    <div className="border border-gray-400 rounded p-3 mt-2 flex flex-col gap-4">
                        <label>
                        Task Name:
                            <input
                                name="name"
                                value={taskForm.name}
                                onChange={handleTaskFormChange}
                                required
                                className="input input-bordered w-full"
                            />
                        </label>
                        <label>
                        Task Description:
                            <textarea
                                name="description"
                                value={taskForm.description}
                                onChange={handleTaskFormChange}
                                className="textarea textarea-bordered w-full"
                            />
                        </label>
                        <label>
                        Task Due Date:
                            <input
                                type="date"
                                name="dueDate"
                                value={taskForm.dueDate}
                                onChange={handleTaskFormChange}
                                required
                                className="input input-bordered w-full"
                            />
                        </label>
                        <label>
                        Priority:
                            <select
                                name="priority"
                                value={taskForm.priority}
                                onChange={handleTaskFormChange}
                                required
                                className="select select-bordered w-full"
                            >
                                <option value="">Select</option>
                                <option value="Low">Low</option>
                                <option value="Normal">Normal</option>
                                <option value="High">High</option>
                            </select>
                        </label>
                            <div className="mt-3">
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
                                    <button
                                        type="button"
                                        onClick={handleAddSubtask}
                                        className="btn btn-accent w-full md:w-auto mt-2 create-project-from-button-secondary"
                                    >
                                        Add Subtask
                                    </button>
                                )}

                                
                                {showSubtaskForm && (
                                <div className="border border-gray-300 rounded p-2 mt-2 flex flex-col gap-4">
                                    <label>
                                    Subtask Name:
                                        <input
                                            name="name"
                                            value={subtaskForm.name}
                                            onChange={handleSubtaskFormChange}
                                            required
                                            className="input input-bordered w-full"
                                        />
                                    </label>
                                    <label>
                                    Subtask Description:
                                        <textarea
                                            name="description"
                                            value={subtaskForm.description}
                                            onChange={handleSubtaskFormChange}
                                            className="textarea textarea-bordered w-full"
                                        />
                                    </label>
                                    <label>
                                    Add Users:
                                        <select
                                            onChange={(e) => handleUserSelect(Number(e.target.value))}
                                            value=""
                                            className="select select-bordered w-full"
                                        >
                                            <option value="">Select user</option>
                                            {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                            ))}
                                        </select>
                                    </label>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {subtaskForm.users.map((user) => (
                                                <span key={user.id} className="badge badge-outline">
                                                    {user.name}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveUser(user.id)}
                                                        className="ml-1 text-red-500"
                                                    >
                                                        x
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddSubtaskToTask}
                                            className="btn btn-success w-full md:w-auto mt-2 create-project-from-button"
                                        >
                                            Save Subtask
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={handleAddTaskToList}
                                className="btn btn-info w-full md:w-auto mt-3 create-project-from-button"
                            >
                                Save Task
                            </button>
                        </div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary mt-4 w-full md:w-auto create-project-from-button">
                        Submit Project
                </button>
            </form>
        </div>
    );
};

export default CreateProject;