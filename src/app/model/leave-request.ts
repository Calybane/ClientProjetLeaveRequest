
export class LeaveRequest {
  id: number;
  personId: number;
  typeAbsence: string;
  leaveFrom: Date;
  leaveTo: Date;
  daysTaken: number;
  requestDate: Date;
  approvalDate: Date;
  status: string;

  constructor(values: Object = {}) {
    this.leaveFrom = new Date();
    this.leaveTo = new Date();
    this.leaveFrom.setDate(this.leaveFrom.getDate() + 1);
    this.leaveTo.setDate(this.leaveFrom.getDate());
    this.daysTaken = 1;
    this.requestDate = new Date();
    this.approvalDate = null;
    this.status = 'Waiting for validation'

    Object.assign(this, values);
  }
}
