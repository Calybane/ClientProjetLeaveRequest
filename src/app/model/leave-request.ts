
export class LeaveRequest {
  id: number;
  personId: number;
  typeAbsence: string;
  leaveFromDate: Date;
  leaveToDate: Date;
  daysTaken: number;
  requestDate: Date;
  approval: Date;

  constructor(personId: number) {
    this.personId = personId;
    this.daysTaken = 0;
    this.requestDate = new Date();
    this.leaveFromDate = new Date();
    this.leaveToDate = new Date();
    this.leaveFromDate.setDate(this.leaveFromDate.getDate() + 1);
    this.leaveToDate.setDate(this.leaveFromDate.getDate());
  }

}
