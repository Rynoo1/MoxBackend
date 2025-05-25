export interface EmergencyMeeting {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  projectID: number;
  createdByUserId: string;
  isResolved: boolean;
}