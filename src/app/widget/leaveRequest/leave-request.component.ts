import { Component, OnInit } from '@angular/core';
import { LeaveRequest } from '../../model/leave-request';
import { Person } from '../../model/person';
import { SelectItem } from 'primeng/primeng';
import { LeaveRequestDataService } from '../../service/leave-request-data.service';
import { PersonDataService } from '../../service/person-data.service';
import { SharedDataService } from '../../service/shared-data.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css'],
  providers: [LeaveRequestDataService, PersonDataService]
})

export class LeaveRequestComponent implements OnInit {

  en: any;

  minDate: Date;
  maxDate: Date;
  dateTemp: Date;
  showWellSpecial: boolean;
  daysTotal: number;
  types: SelectItem[];

  disabledDates: Date[];

  person: Person;

  leaveRequest: LeaveRequest = new LeaveRequest();

  constructor(private leaveRequestDataService: LeaveRequestDataService, private personService: PersonDataService, private leaveRequestService: LeaveRequestDataService, private sharedService: SharedDataService) {
    this.disabledDates = new Array<Date>();
    this.leaveRequestService.getAllLeaveRequestsByPersonId(1).subscribe(requests => {
      requests.forEach(request => {
        const currentDate: Date = new Date(request.leaveFrom);
        const stopDate: Date = new Date(request.leaveTo);
        for (let i = 0; currentDate <= stopDate && i < 100; ++i) {
          this.disabledDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
    });
  }

  ngOnInit() {
    this.en = { firstDayOfWeek: 0 };
    this.types = [];
    this.sharedService.typeAbsence.forEach((key: string, value: string) => {
      this.types.push({label: key, value: value});
    });
    this.leaveRequest.typeAbsence = this.types[0].value;
    this.onChangeTypes();

    this.minDate = new Date(this.leaveRequest.leaveFrom);
    this.dateTemp = new Date(this.leaveRequest.leaveFrom);

    this.personService.getPersonById(1).subscribe(person => {
      this.person = person;
      this.daysTotal = this.person.getDaysLeft();
      this.changeMaxDate();
      this.leaveRequest.personId = this.person.getId();
    });
  }

  onSubmit() {
    if (this.leaveRequestValid())
    {
      this.createLeaveRequest();
      console.log('Request submited');
    }
    else
    {
      console.log('Leave Request not valid');
    }
  }

  createLeaveRequest() {
    this.leaveRequestDataService.createLeaveRequest(this.leaveRequest).subscribe(reponse => {
      this.leaveRequest = new LeaveRequest();
      this.leaveRequest.personId = this.person.getId();
      this.leaveRequest.typeAbsence = this.types[0].value;
    });
  }

  onChangeTypes() {
    if (this.leaveRequest.typeAbsence === 'Special leave') {
      this.showWellSpecial = true;
    } else {
      this.showWellSpecial = false;
    }
  }

  leaveRequestValid(): boolean {
    return this.leaveRequest.leaveFrom.getDate() <= this.leaveRequest.leaveTo.getDate()
      && this.leaveRequest.daysTaken > 0
      && this.leaveRequest.daysTaken <= this.daysTotal
      && this.sharedService.typeAbsence.get(this.leaveRequest.typeAbsence) != null;
  }

  changeDaysTaken(): void {
    let nb = 0;
    const currentDate: Date = new Date();
    currentDate.setDate(this.leaveRequest.leaveFrom.getDate());
    const endDate: Date = new Date();
    endDate.setDate(this.leaveRequest.leaveTo.getDate());
    for (let i = 0; currentDate <= endDate && i < 100; ++i) {
      // depend of first day of week. here, first day is Sunday == 0 and Saturday == 6
      if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
        ++nb;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    this.leaveRequest.daysTaken = nb;
  }

  changeMaxDate(): void {
    this.maxDate = new Date();
    this.maxDate.setDate(this.leaveRequest.leaveFrom.getDate());
    for (let i = 1; i < this.daysTotal; ++i) {
      this.maxDate.setDate(this.maxDate.getDate() + 1);
      // depend of first day of week. here, first day is Sunday == 0 and Saturday == 6
      if (this.maxDate.getDay() === 0 || this.maxDate.getDay() === 6) {
        --i;
      }
    }
  }

}
