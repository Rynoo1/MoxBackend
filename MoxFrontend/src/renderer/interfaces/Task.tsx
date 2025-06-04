
//src/interfaces/
import { WorkStatus, PriorityLevel } from './TaskEnums'

export interface TaskDto {
  taskId?: number
  title: string
  description?: string
  projectID: number
  assignedTo?: string[]
  dueDate?: string
  priority: PriorityLevel
  status: WorkStatus
  deadline?: string
  isEmergency: boolean
}
