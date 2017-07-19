import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {LeaveRequest} from '../../model/leave-request';
import {Person} from '../../model/person';
import {SelectItem} from 'primeng/primeng';
import {LeaveRequestDataService} from '../../service/leave-request-data.service';
import {PersonDataService} from '../../service/person-data.service';
import {SharedDataService} from '../../service/shared-data.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css'],
  providers: [LeaveRequestDataService, PersonDataService]
})

export class LeaveRequestComponent implements OnInit {

  minDate: Date;
  showWellSpecial: boolean;
  daysTotal: number;
  types: SelectItem[];

  person: Person;

  leaveRequest: LeaveRequest = new LeaveRequest();

  constructor(private leaveRequestDataService: LeaveRequestDataService, private personService: PersonDataService, private sharedService: SharedDataService) {}

  ngOnInit() {
    this.types = [];
    this.sharedService.typeAbsence.forEach((key: string, value: string) => {
      this.types.push({label: key, value: value});
    });
    this.leaveRequest.typeAbsence = this.types[0].value;
    this.onChangeTypes();

    this.minDate = new Date();
    this.minDate.setDate(this.leaveRequest.leaveFrom.getDate());

    this.personService.getPersonById(3).subscribe(person => {
      this.person = person;
      this.daysTotal = this.person.getDaysLeft();
      this.leaveRequest.personId = this.person.getId();
    });
  }

  onSubmit() {
    if (this.leaveRequestValid()) {
      this.createLeaveRequest();
      console.log('Request submited');
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
}
