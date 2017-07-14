import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {LeaveRequest} from '../../model/leave-request';
import {SelectItem} from 'primeng/primeng';
import {LeaveRequestDataService} from '../../service/leave-request-data.service';
import {SharedDataService} from '../../service/shared-data.service';

@Component({
  selector: 'app-vacation-demand',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css'],
  providers: [LeaveRequestDataService]
})

export class LeaveRequestComponent implements OnInit {

  minDate: Date;
  showWellSpecial: boolean;
  daysTotal: number;
  types: SelectItem[];

  leaveRequest: LeaveRequest = new LeaveRequest(this.sharedData.getPersonId());

  constructor(private leaveRequestDataService: LeaveRequestDataService, private sharedData: SharedDataService) {}

  ngOnInit() {
    this.types = [];
    this.types.push({label: 'Annual leave', value: 'annual'});
    this.types.push({label: 'Special leave *', value: 'special'});
    this.leaveRequest.typeAbsence = 'annual';
    this.onChangeTypes();
    this.daysTotal = this.sharedData.getPersonDaysLeft();

    this.minDate = new Date();

    this.minDate.setDate(this.leaveRequest.leaveFromDate.getDate());
  }

  onSubmit() {
    if (this.leaveRequest.leaveFromDate.getDate() <= this.leaveRequest.leaveToDate.getDate()) {
      this.addLeaveRequest();
      console.log('Request submited');
    }
  }

  addLeaveRequest() {
    this.leaveRequestDataService.addLeaveRequest(this.leaveRequest);
    this.leaveRequest = new LeaveRequest(this.sharedData.getPersonId());
  }

  onChangeTypes() {
    if (this.leaveRequest.typeAbsence === 'special') {
      this.showWellSpecial = true;
    } else {
      this.showWellSpecial = false;
    }
  }
}
