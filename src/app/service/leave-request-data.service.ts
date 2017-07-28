import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {environment} from 'environments/environment';

import {LeaveRequest} from '../model/leave-request';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = environment.apiUrl;

@Injectable()
export class LeaveRequestDataService {

  constructor(private http: Http) { }


  public getAllTypesAbsence(): Observable<string[]> {
    return this.http.get(API_URL + '/api/leaverequest/typesabsence')
      .map(response => {
        const requests = response.json();
        return requests.map(request => request);
      })
      .catch(this.handleError);
  }


  public getAllLeaveRequests(): Observable<LeaveRequest[]> {
    return this.http.get(API_URL + '/api/leaverequest')
      .map(response => {
        const requests = response.json().content;
        return requests.map(request => new LeaveRequest(request));
      })
      .catch(this.handleError);
  }


  public getAllLeaveRequestsByStatus(status: string, paging: string): Observable<any> {
    return this.http.get(API_URL + '/api/leaverequest/' + status + paging)
      .map(response => response.json())
      .catch(this.handleError);
  }


  public getAllLeaveRequestsByPersonId(personId: number, paging: string): Observable<any> {
    return this.http.get(API_URL + '/api/leaverequest/person/' + personId + paging)
      .map(response => response.json())
      .catch(this.handleError);
  }


  public getLeaveRequestById(requestId: number): Observable<LeaveRequest> {
    return this.http.get(API_URL + '/api/leaverequest/' + requestId)
      .map(response => new LeaveRequest(response.json()))
      .catch(this.handleError);
  }


  public createLeaveRequest(request: LeaveRequest): Observable<LeaveRequest> {
    return this.http.post(API_URL + '/api/leaverequest', request)
      .map(response => new LeaveRequest(response.json()))
      .catch(this.handleError);
  }


  public updateLeaveRequest(request: LeaveRequest): Observable<LeaveRequest> {
    return this.http.put(API_URL + '/api/leaverequest/' + request.id, request)
      .map(response => new LeaveRequest(response.json()))
      .catch(this.handleError);
  }

  public deleteLeaveRequestById(requestId: number): Observable<null> {
    return this.http.delete(API_URL + '/api/leaverequest/' + requestId)
      .map(response => null)
      .catch(this.handleError);
  }


  public approvedLeaveRequestByManager(request: LeaveRequest): Observable<LeaveRequest> {
    return this.http.put(API_URL + '/api/leaverequest/' + request.id + '/changestatus/approved/manager', request)
      .map(response => new LeaveRequest(response.json()))
      .catch(this.handleError);
  }


  public approvedLeaveRequestByHR(request: LeaveRequest): Observable<LeaveRequest> {
    return this.http.put(API_URL + '/api/leaverequest/' + request.id + '/changestatus/approved/hr', request)
      .map(response => new LeaveRequest(response.json()))
      .catch(this.handleError);
  }


  public rejectedLeaveRequest(request: LeaveRequest): Observable<LeaveRequest> {
    return this.http.put(API_URL + '/api/leaverequest/' + request.id + '/changestatus/rejected', request)
      .map(response => new LeaveRequest(response.json()))
      .catch(this.handleError);
  }

  /*
  public generatePDF(request: LeaveRequest): Observable<any> {
    return this.http.get(API_URL + '/api/leaverequest/' + request.id + '/pdf', request)
      .map(response => request)
      .catch(this.handleError);
  }
  */

  private handleError (error: Response | any) {
    console.error('ApiLeaveRequestService::handleError', error);
    return Observable.throw(error);
  }

}
