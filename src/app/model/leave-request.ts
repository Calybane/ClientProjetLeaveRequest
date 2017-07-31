
export class LeaveRequest {
  id: number;
  personId: number;
  typeAbsence: string;
  leaveFrom: Date = new Date();
  leaveTo: Date = new Date();
  daysTaken: number = 1;
  requestDate: Date = new Date();
  approvalManagerDate: Date = null;
  approvalHRDate: Date = null;
  status: string = '';

  constructor(values: Object = {}) {
    this.setDates();
    this.leaveFrom.setHours(0, 0, 0, 0);
    this.leaveTo.setHours(0, 0, 0, 0);

    Object.assign(this, values);
  }

  setDates(): void {
    if (this.leaveFrom.getDay() === 5) {
      this.leaveFrom.setDate(this.leaveFrom.getDate() + 3);
      this.leaveTo.setDate(this.leaveTo.getDate() + 3);
    } else if (this.leaveFrom.getDay() === 6) {
      this.leaveFrom.setDate(this.leaveFrom.getDate() + 2);
      this.leaveTo.setDate(this.leaveTo.getDate() + 2);
    } else {
      this.leaveFrom.setDate(this.leaveFrom.getDate() + 1);
      this.leaveTo.setDate(this.leaveTo.getDate() + 1);
    }
  }

  getApprovalManager(): string {
    if (this.status === 'Rejected' && this.approvalHRDate == null) {
      return 'Date of reject by manager: ';
    } else {
      return 'Date of approval by manager : ';
    }
  }

  getApprovalHR(): string {
    if (this.status === 'Rejected' && this.approvalHRDate != null) {
      return 'Date of reject by HR : ';
    } else {
      return 'Date of approval by HR : ';
    }
  }

  showApprovalHRDate(): boolean {
    return (this.status !== 'Rejected' && this.approvalManagerDate != null) || (this.status === 'Rejected' && this.approvalHRDate != null);
  }
}
