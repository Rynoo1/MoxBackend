// export enum WorkStatus {
//   NotStarted = 'NotStarted',
//   InProgress = 'InProgress',
//   Completed = 'Completed',
//   Canceled = 'Canceled'
// }

// interfaces/TaskEnums.ts
export enum WorkStatus {
  NotStarted = 0,
  InProgress = 1,
  Blocked = 2,
  Completed = 3
}

export enum PriorityLevel {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}
