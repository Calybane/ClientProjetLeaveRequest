import {Component, OnInit} from '@angular/core';
import {LeaveRequest} from '../../model/leave-request';
import {Person} from '../../model/person';
import {SelectItem} from 'primeng/primeng';
import {LeaveRequestDataService} from '../../service/leave-request-data.service';
import {PersonDataService} from '../../service/person-data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css'],
  providers: [LeaveRequestDataService, PersonDataService]
})

export class LeaveRequestComponent implements OnInit {

  minDate: Date;
  maxDate: Date;
  validForm: boolean;
  showWellSpecial: boolean;
  requestSubmitted: string;
  daysTotal: number;
  types: SelectItem[];

  disabledDates: Date[] = new Array<Date>();

  person: Person;

  leaveRequest: LeaveRequest;

  constructor(private leaveRequestDataService: LeaveRequestDataService, private personService: PersonDataService, private leaveRequestService: LeaveRequestDataService) {
  }

  ngOnInit() {
    this.requestSubmitted = '';

    this.setLeaveRequest();
    this.minDate = moment(this.leaveRequest.leaveFrom).toDate();

    this.types = [];
    this.leaveRequestDataService.getAllTypesAbsence().subscribe(response => {
      response.forEach(type => {
        this.types.push({label: type, value: type});
      });
      this.leaveRequest.typeAbsence = this.types[0].value;
      this.onChangeTypes();
    });

    this.personService.getPersonById(1).subscribe(person => {
      this.person = person;
      this.daysTotal = this.person.daysLeft;
      this.changeMaxDate();
      this.leaveRequest.personId = this.person.id;
      this.validForm = this.daysTotal > 0 && this.leaveRequest.daysTaken <= this.daysTotal && this.leaveRequest.leaveFrom <= this.leaveRequest.leaveTo;
    });
  }

  onSubmit() {
    if (this.leaveRequestValid()) {
      if (this.createLeaveRequest()) {
        this.requestSubmitted = 'Request submitted';
      } else {
        this.requestSubmitted = 'Error: The request can not be submitted';
      }
    } else {
      this.requestSubmitted = 'Request not valid';
    }
  }

  leaveRequestValid(): boolean {
    return this.leaveRequest.leaveFrom <= this.leaveRequest.leaveTo
      && this.leaveRequest.daysTaken > 0
      && this.leaveRequest.daysTaken <= this.daysTotal;
  }

  createLeaveRequest(): boolean {
    if (this.leaveRequestDataService.createLeaveRequest(this.leaveRequest).subscribe()) {
      this.setLeaveRequest();
      this.leaveRequest.typeAbsence = this.types[0].value;
      this.leaveRequest.personId = this.person.id;
      return true;
    } else {
      return false;
    }
  }

  setLeaveRequest(): void {
    this.leaveRequest = null;
    this.leaveRequest = {
      id: null,
      personId: 0,
      typeAbsence: '',
      leaveFrom: moment().toDate(),
      leaveTo: moment().toDate(),
      daysTaken: 1,
      requestDate: moment().toDate(),
      approvalManagerDate: null,
      approvalHRDate: null,
      status: '',
      description: '',
    };

    this.setDates();
  }

  onChangeTypes() {
    if (this.leaveRequest.typeAbsence === 'Special leave') {
      this.showWellSpecial = true;
    } else {
      this.showWellSpecial = false;
    }
  }

  changeDaysTaken(): void {
    let nb = 0;
    const currentDate = moment(this.leaveRequest.leaveFrom).toDate();
    const endDate = moment(this.leaveRequest.leaveTo).toDate();
    for (let i = 0; currentDate <= endDate && i < 100; ++i) {
      // depend of first day of week. here, first day is Sunday == 0 and Saturday == 6
      if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
        ++nb;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    this.leaveRequest.daysTaken = nb;
    this.validForm = this.daysTotal > 0 && this.leaveRequest.daysTaken <= this.daysTotal && this.leaveRequest.leaveFrom <= this.leaveRequest.leaveTo;
  }

  setDates(): void {
    // set date to next open day
    if (this.leaveRequest.leaveFrom.getDay() === 5) {
      this.leaveRequest.leaveFrom.setDate(this.leaveRequest.leaveFrom.getDate() + 3);
      this.leaveRequest.leaveTo.setDate(this.leaveRequest.leaveTo.getDate() + 3);
    } else if (this.leaveRequest.leaveFrom.getDay() === 6) {
      this.leaveRequest.leaveFrom.setDate(this.leaveRequest.leaveFrom.getDate() + 2);
      this.leaveRequest.leaveTo.setDate(this.leaveRequest.leaveTo.getDate() + 2);
    } else {
      this.leaveRequest.leaveFrom.setDate(this.leaveRequest.leaveFrom.getDate() + 1);
      this.leaveRequest.leaveTo.setDate(this.leaveRequest.leaveTo.getDate() + 1);
    }
  }

  changeMaxDate(): void {
    this.maxDate = moment(this.leaveRequest.leaveFrom).toDate();
    for (let i = 1; i < this.daysTotal; ++i) {
      this.maxDate = moment(this.maxDate).add(1, 'day').toDate();
      // depend of first day of week. here, first day is Sunday == 0 and Saturday == 6
      if (this.maxDate.getDay() === 0 || this.maxDate.getDay() === 6) {
        --i;
      }
    }
  }

}
