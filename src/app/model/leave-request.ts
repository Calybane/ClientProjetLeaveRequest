
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
    this.setDates();
    this.leaveTo = new Date();
    this.leaveTo.setDate(this.leaveFrom.getDate());
    this.daysTaken = 1;
    this.requestDate = new Date();
    this.approvalDate = null;
    this.status = 'Waiting for approval'

    Object.assign(this, values);
  }

  setDates(): void {
    if (this.leaveFrom.getDay() === 5) {
      this.leaveFrom.setDate(this.leaveFrom.getDate() + 3);
    } else if (this.leaveFrom.getDay() === 6) {
      this.leaveFrom.setDate(this.leaveFrom.getDate() + 2);
    } else {
      this.leaveFrom.setDate(this.leaveFrom.getDate() + 1);
    }
  }

  getApproval(): string {
    if (this.status === 'Rejected') {
      return 'Date of reject : ';
    } else {
      return 'Date of approval : ';
    }
  }
}
