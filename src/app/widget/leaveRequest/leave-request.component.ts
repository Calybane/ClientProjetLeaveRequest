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
  daysTotal: number;
  types: SelectItem[];

  fr: any;

  disabledDates: Date[] = Array<Date>();

  person: Person;

  leaveRequest: LeaveRequest;
  requestSubmitted: RequestSubmit;

  constructor(private leaveRequestDataService: LeaveRequestDataService, private personService: PersonDataService, private leaveRequestService: LeaveRequestDataService) {
  }

  ngOnInit() {
    this.setLeaveRequest();

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
      this.leaveRequest.personId = this.person.id;
      this.validForm = this.daysTotal > 0 && this.leaveRequest.daysTaken <= this.daysTotal && this.leaveRequest.leaveFrom <= this.leaveRequest.leaveTo;

      this.changeMaxDate();
      this.setDisabledDates();
    });
  }

  onSubmit() {
    if (this.leaveRequestValid()) {
      if (this.createLeaveRequest()) {
        this.requestSubmitted = {
          message: 'Request submitted',
          style: 'alert alert-success'
        };
        this.addDisabledDates(this.leaveRequest.leaveFrom, this.leaveRequest.leaveTo);
        this.setLeaveRequest();
        this.leaveRequest.typeAbsence = this.types[0].value;
        this.leaveRequest.personId = this.person.id;
      } else {
        this.requestSubmitted = {
          message: 'The request can not be submitted',
          style: 'alert alert-warning'
        };
      }
    } else {
      this.requestSubmitted = {
        message: 'The request is not valid',
        style: 'alert alert-danger'
      };
    }
  }

  leaveRequestValid(): boolean {
    return this.leaveRequest.leaveFrom <= this.leaveRequest.leaveTo
      && this.leaveRequest.daysTaken > 0
      && this.leaveRequest.daysTaken <= this.daysTotal
      && !this.intersectDates(this.leaveRequest.leaveFrom, this.leaveRequest.leaveTo, this.disabledDates);
  }

  createLeaveRequest(): boolean {
    this.leaveRequest.description = this.person.firstname + ' ' + this.person.lastname
      + (this.leaveRequest.description ? (' : ' + this.leaveRequest.description) : '');
    if (this.leaveRequestDataService.createLeaveRequest(this.leaveRequest).subscribe()) {
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
      description: ''
    };

    this.setDates();
  }

  onChangeTypes() {
    return (this.leaveRequest.typeAbsence === 'Special leave');
  }

  changeDaysTaken(): void {
    let nb = 0;
    let currentDate = moment(this.leaveRequest.leaveFrom).toDate();
    const endDate = moment(this.leaveRequest.leaveTo).toDate();
    for (let i = 0; currentDate <= endDate && i < 100; ++i) {
      // depend of first day of week. here, first day is Sunday == 0 and Saturday == 6
      if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
        ++nb;
      }
      currentDate = moment(currentDate).add(1, 'day').toDate();
    }

    this.leaveRequest.daysTaken = nb;
    this.validForm = this.daysTotal > 0 && this.leaveRequest.daysTaken <= this.daysTotal && this.leaveRequest.leaveFrom <= this.leaveRequest.leaveTo;
  }

  setDates(): void {
    // set date to next open day
    if (this.leaveRequest.leaveFrom.getDay() === 5) {
      this.leaveRequest.leaveFrom = moment(this.leaveRequest.leaveFrom).add(3, 'day').toDate();
      this.leaveRequest.leaveTo = moment(this.leaveRequest.leaveTo).add(3, 'day').toDate();
    } else if (this.leaveRequest.leaveFrom.getDay() === 6) {
      this.leaveRequest.leaveFrom = moment(this.leaveRequest.leaveFrom).add(2, 'day').toDate();
      this.leaveRequest.leaveTo = moment(this.leaveRequest.leaveTo).add(2, 'day').toDate();
    } else {
      this.leaveRequest.leaveFrom = moment(this.leaveRequest.leaveFrom).add(1, 'day').toDate();
      this.leaveRequest.leaveTo = moment(this.leaveRequest.leaveTo).add(1, 'day').toDate();
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

  setDisabledDates(): void {
    this.leaveRequestService.getAllDisabledDatesByPersonId(1).subscribe(requests => {
      requests.forEach(date => {
        this.disabledDates.push(moment(date).toDate());
      });
      this.minDate = moment(this.leaveRequest.leaveFrom).toDate();
    });
  }

  addDisabledDates(startDate: Date, endDate: Date): void {
    while (startDate <= endDate) {
      this.disabledDates.push(startDate);
      startDate = moment(startDate).add(1, 'day').toDate();
    }
    this.disabledDates.map(e => e);
  }

  intersectDates(startDate: Date, endDate: Date, dates: Array<Date>): boolean {
    const array: Date[] = Array<Date>();
    while (startDate <= endDate) {
      array.push(startDate);
      startDate = moment(startDate).add(1, 'day').toDate();
    }
    for (let i = 0; i < array.length; ++i) {
      if (dates.find(date => date.getDate() === array[i].getDate())) {
        return true;
      }
    }
    return false;
  }

}

export interface RequestSubmit {
  message: string;
  style: string;
}
