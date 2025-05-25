import { WorkStatus, PriorityLevel } from "../src/models/TaskEnums";

export interface TaskDto {
  taskId?: number;
  title: string;
  description?: string;
  projectID: number;
  assignedTo?: string[];
  priority: PriorityLevel;
  status: WorkStatus;
  deadline?: string;
  isEmergency: boolean;
}