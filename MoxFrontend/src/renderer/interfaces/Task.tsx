// import { WorkStatus, PriorityLevel } from './TaskEnums'

// export interface TaskDto {
//   taskId?: number
//   title: string
//   description?: string
//   priority: number
//   status: number
//   dueDate: string
//   startDate?: string
//   endDate?: string
//   completedAt?: string
//   isEmergency: boolean
//   assignedUserId?: string
//   projectID: number
// }

import { WorkStatus, PriorityLevel } from './TaskEnums'

export interface TaskDto {
  taskId?: number
  title: string
  description?: string
  priority: number
  status: number
  dueDate: string
  startDate?: string
  endDate?: string
  completedAt?: string
  isEmergency: boolean
  assignedUserId?: string
  projectID: number
}
