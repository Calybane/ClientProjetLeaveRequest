import {Component, OnInit} from '@angular/core';
import {LeaveRequest} from '../../model/leave-request';
import {SelectItem} from 'primeng/primeng';
import {LeaveRequestService} from '../../service/leave-request.service';
import {UserService} from '../../service/user.service';
import {SharedService} from '../../service/shared.service';
import * as moment from 'moment';
import 'moment/locale/fr';
import {User} from '../../model/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css'],
  providers: [LeaveRequestService, UserService]
})

export class LeaveRequestComponent implements OnInit {

  minDate: Date;
  maxDate: Date;
  validForm: boolean = false;
  showWellSpecial: boolean;
  types: SelectItem[];

  disabledDates: Date[] = Array<Date>();

  leaveRequest: LeaveRequest;
  requestSubmitted: RequestSubmit;

  constructor(private leaveRequestService: LeaveRequestService,
              private userService: UserService,
              private sharedService: SharedService,
              private router: Router) {}

  ngOnInit() {
    this.setLeaveRequest();

    this.minDate = this.leaveRequest.leaveFrom;
    this.maxDate = moment().toDate();

    this.types = [];
    this.leaveRequestService.getAllTypesAbsence().subscribe(response => {
      response.forEach(type => {
        this.types.push({label: type, value: type});
      });
      this.leaveRequest.typeAbsence = this.types[0].value;
      this.onChangeTypes();
    });

    this.changeMaxDate();

    this.initialize();
  }

  initialize() {
    if (!this.sharedService.user.login) {
      this.userService.getUserConnected().subscribe(user => {
        if (user) {
          this.sharedService.user = user;
          this.sharedService.getRoles();
          this.leaveRequest.login = this.sharedService.user.login;
          this.setDisabledDates();
        } else {
          console.log('User not connected');
          this.router.navigate(['/signin']);
          return;
        }
      }, error => {
        console.log('Error : user not connected');
        this.router.navigate(['/signin']);
        return;
      });
    } else {
      this.setDisabledDates();
    }
  }

  onSubmit() {
    if (this.leaveRequestValid()) {
      this.createLeaveRequest();
    } else {
      this.requestSubmitted = {
        message: 'The request is not valid',
        style: 'alert alert-danger'
      };
    }
  }

  userDaysLeft(): number {
    return this.sharedService.user.daysLeft;
  }

  leaveRequestValid(): boolean {
    return this.leaveRequest.leaveFrom <= this.leaveRequest.leaveTo
      && this.leaveRequest.daysTaken > 0
      && this.leaveRequest.daysTaken <= this.userDaysLeft()
      && !this.intersectDates(this.leaveRequest.leaveFrom, this.leaveRequest.leaveTo, this.disabledDates);
  }

  createLeaveRequest() {
    this.leaveRequestService.createLeaveRequest(this.leaveRequest).subscribe(request => {
      if (request) {
        this.requestSubmitted = {
          message: 'Request submitted',
          style: 'alert alert-success'
        };
        const user: User = {login: this.sharedService.user.login, daysLeft: (this.sharedService.user.daysLeft - this.leaveRequest.daysTaken)}
        this.userService.updateUser(user).subscribe(response => {
          this.sharedService.user = response;
          this.setValidForm();
        });
        this.addDisabledDates(this.leaveRequest.leaveFrom, this.leaveRequest.leaveTo);
        this.setLeaveRequest();
        this.leaveRequest.typeAbsence = this.types[0].value;
      } else {
        this.requestSubmitted = {
          message: 'The request is not valid',
          style: 'alert alert-danger'
        };
      }
    }, error => {
      this.requestSubmitted = {
        message: 'The request can not be submitted',
        style: 'alert alert-danger'
      };
    });
  }

  setLeaveRequest(): void {
    this.leaveRequest = {
      id: null,
      login: this.sharedService.user.login,
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

  setValidForm() {
    this.validForm = this.userDaysLeft() > 0
      && this.leaveRequest.daysTaken <= this.userDaysLeft()
      && moment(this.leaveRequest.leaveFrom.toISOString()).toDate() <= moment(this.leaveRequest.leaveTo.toISOString()).toDate()
      && !this.intersectDates(this.leaveRequest.leaveFrom, this.leaveRequest.leaveTo, this.disabledDates);
  }

  onChangeTypes() {
    return (this.leaveRequest.typeAbsence === 'Special leave');
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
    this.setValidForm();
  }

  changeMaxDate(): void {
    this.maxDate = moment(this.leaveRequest.leaveFrom).toDate();
    for (let i = 1; i < this.userDaysLeft(); ++i) {
      this.maxDate = moment(this.maxDate).add(1, 'day').toDate();
      // depend of first day of week. here, first day is Sunday == 0 and Saturday == 6
      if (this.maxDate.getDay() === 0 || this.maxDate.getDay() === 6) {
        --i;
      }
    }
  }

  setDisabledDates(): void {
    this.leaveRequestService.getAllDisabledDatesByLogin(this.sharedService.user.login).subscribe(requests => {
      if (requests.length > 0) {
        requests.forEach(date => {
          this.disabledDates.push(moment(date).toDate());
        });
      }

      this.minDate = moment(this.leaveRequest.leaveFrom).toDate();
      this.setValidForm();
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
