import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { Http, Response } from '@angular/http';
import { LeaveRequest } from '../model/leave-request';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = environment.apiUrl;

@Injectable()
export class ApiLeaveRequestService {

  constructor(private http: Http) {
  }

  public getAllLeaveRequest(): Observable<LeaveRequest[]> {
    return this.http.get(API_URL + '/leaveRequests')
                    .map(response => {  const requests = response.json();
                                        return requests.map((request) => new LeaveRequest(request));
                    })
                    .catch(this.handleError);
  }

  public createLeaveRequest(request: LeaveRequest): Observable<LeaveRequest> {
    return this.http.post(API_URL + '/leaveRequests', request)
                    .map(response => new LeaveRequest(response.json()))
                    .catch(this.handleError);
  }

  public getLeaveRequestById(requestId: number): Observable<LeaveRequest> {
    return this.http.get(API_URL + '/leaveRequests/' + requestId)
                    .map(response => new LeaveRequest(response.json()))
                    .catch(this.handleError);
  }

  public updateLeaveRequest(request: LeaveRequest): Observable<LeaveRequest> {
    return this.http.put(API_URL + '/leaveRequests/' + request.id, request)
                    .map(response => new LeaveRequest(response.json()))
                    .catch(this.handleError);
  }

  public deleteLeaveRequestById(requestId: number): Observable<null> {
    return this.http.delete(API_URL + '/leaveRequests/' + requestId)
                    .map(response => null)
                    .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    console.error('ApiLeaveRequestService::handleError', error);
    return Observable.throw(error);
  }

}
