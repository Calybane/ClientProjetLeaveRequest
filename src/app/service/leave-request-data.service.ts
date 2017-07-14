import { Injectable } from '@angular/core';
import { LeaveRequest } from '../model/leave-request';
import { ApiLeaveRequestService } from '../service/api-leave-request.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LeaveRequestDataService {

  constructor(private apiLeaveRequest: ApiLeaveRequestService) { }

  addLeaveRequest(leaveRequest: LeaveRequest): Observable<LeaveRequest> {
    return this.apiLeaveRequest.createLeaveRequest(leaveRequest);
  }

  deleteLeaveRequestByPersonAndDate(requestId: number): Observable<LeaveRequest> {
    return this.apiLeaveRequest.deleteLeaveRequestById(requestId)
  }

  updateLeaveRequestById(request: LeaveRequest): Observable<LeaveRequest> {
    return this.apiLeaveRequest.updateLeaveRequest(request);
  }

  getAllLeaveRequests(): Observable<LeaveRequest[]> {
    return this.apiLeaveRequest.getAllLeaveRequest();
  }

  getLeaveRequestById(requestId: number): Observable<LeaveRequest> {
    return this.apiLeaveRequest.getLeaveRequestById(requestId);
  }

}
