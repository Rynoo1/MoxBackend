import { WorkStatus } from './enums'

export interface User {
  id: string
  UserName: string
  Email: string
  Avatar: string
  AppRoles: AppRoles
  SubTasks: SubTasks
}

export interface RegisterUser {
  UserName: string
  Email: string
}

export interface AppRoles {
  id: number
  Title: string
}

export interface SubTasks {
  id: number
  ProjectId: number
  Title: string
  SubTaskStatus: WorkStatus
}
