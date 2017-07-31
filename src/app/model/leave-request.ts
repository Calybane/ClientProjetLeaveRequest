
export interface LeaveRequest {
  id: number;
  personId: number;
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
