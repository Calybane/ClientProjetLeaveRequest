
export interface LeaveRequest {
  id: number;
  login: string;
  typeAbsence: string;
  leaveFrom: Date;
  leaveTo: Date;
  daysTaken: number;
  requestDate: Date;
  approvalManagerDate: Date;
  approvalHRDate: Date;
  status: string;
  description: string;
}
