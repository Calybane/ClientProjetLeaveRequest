
export class LeaveRequest {
  id: number;
  personId: number;
  typeAbsence: string;
  leaveFrom: Date = new Date();
  leaveTo: Date = new Date();
  daysTaken: number = 1;
  requestDate: Date = new Date();
  approvalDate: Date = null;
  status: string = '';

  constructor(values: Object = {}) {
    this.setDates();
    this.leaveTo.setDate(this.leaveFrom.getDate());

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
