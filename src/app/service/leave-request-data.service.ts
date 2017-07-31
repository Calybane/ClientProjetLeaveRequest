import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {environment} from 'environments/environment';

import {LeaveRequest} from '../model/leave-request';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {LeaveRequestView} from '../view/leave-request-view';

import * as moment from 'moment';

const API_URL = environment.apiUrl;

@Injectable()
export class LeaveRequestDataService {

  constructor(private http: Http) { }


  public getAllTypesAbsence(): Observable<string[]> {
    return this.http.get(API_URL + '/api/leaverequest/typesabsence')
      .map(requests => requests.json().map(request => request))
      .catch(this.handleError);
  }


  public getAllLeaveRequests(): Observable<LeaveRequest[]> {
    return this.http.get(API_URL + '/api/leaverequest')
      .map(requests => {
        return requests.json().content.map(leave => {
          const request = leave.json();
          const leaverequest: LeaveRequest = {
            id: request.id,
            personId: request.personId,
            typeAbsence: request.typeAbsence,
            leaveFrom: request.leaveFrom,
            leaveTo: request.leaveTo,
            daysTaken: request.daysTaken,
            requestDate: request.requestDate,
            approvalManagerDate: request.approvalManagerDate,
            approvalHRDate: request.approvalHRDate,
            status: request.status,
            description: request.description
          }
          return leaverequest;
        });
      })
      .catch(this.handleError);
  }


  public getAllLeaveRequestsView(): Observable<LeaveRequestView[]> {
    return this.http.get(API_URL + '/api/leaverequest/views')
      .map(requests => {
        return requests.json().map(request => {
          const view: LeaveRequestView = {
            id: request.id,
            start: moment(request.leaveFrom).format('YYYY-MM-DD'),
            end: moment(request.leaveTo).add(1, 'day').format('YYYY-MM-DD'),
            title: request.description,
          };
          return view;
        });
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
      .map(response => {
        const request = response.json();
        const leaverequest: LeaveRequest = {
          id: request.id,
          personId: request.personId,
          typeAbsence: request.typeAbsence,
          leaveFrom: request.leaveFrom,
          leaveTo: request.leaveTo,
          daysTaken: request.daysTaken,
          requestDate: request.requestDate,
          approvalManagerDate: request.approvalManagerDate,
          approvalHRDate: request.approvalHRDate,
          status: request.status,
          description: request.description
        }
        return leaverequest;
      })
      .catch(this.handleError);
  }


  public createLeaveRequest(leave: LeaveRequest): Observable<LeaveRequest> {
    return this.http.post(API_URL + '/api/leaverequest', leave)
      .map(response => {
        const request = response.json();
        const leaverequest: LeaveRequest = {
          id: request.id,
          personId: request.personId,
          typeAbsence: request.typeAbsence,
          leaveFrom: request.leaveFrom,
          leaveTo: request.leaveTo,
          daysTaken: request.daysTaken,
          requestDate: request.requestDate,
          approvalManagerDate: request.approvalManagerDate,
          approvalHRDate: request.approvalHRDate,
          status: request.status,
          description: request.description
        }
        return leaverequest;
      })
      .catch(this.handleError);
  }


  public updateLeaveRequest(leave: LeaveRequest): Observable<LeaveRequest> {
    return this.http.put(API_URL + '/api/leaverequest/' + leave.id, leave)
      .map(response => {
        const request = response.json();
        const leaverequest: LeaveRequest = {
          id: request.id,
          personId: request.personId,
          typeAbsence: request.typeAbsence,
          leaveFrom: request.leaveFrom,
          leaveTo: request.leaveTo,
          daysTaken: request.daysTaken,
          requestDate: request.requestDate,
          approvalManagerDate: request.approvalManagerDate,
          approvalHRDate: request.approvalHRDate,
          status: request.status,
          description: request.description
        }
        return leaverequest;
      })
      .catch(this.handleError);
  }


  public deleteLeaveRequestById(requestId: number): Observable<null> {
    return this.http.delete(API_URL + '/api/leaverequest/' + requestId)
      .map(response => null)
      .catch(this.handleError);
  }


  public approvedLeaveRequestByManager(leave: LeaveRequest): Observable<LeaveRequest> {
    return this.http.put(API_URL + '/api/leaverequest/' + leave.id + '/changestatus/approved/manager', leave)
      .map(response => {
        const request = response.json();
        const leaverequest: LeaveRequest = {
          id: request.id,
          personId: request.personId,
          typeAbsence: request.typeAbsence,
          leaveFrom: request.leaveFrom,
          leaveTo: request.leaveTo,
          daysTaken: request.daysTaken,
          requestDate: request.requestDate,
          approvalManagerDate: request.approvalManagerDate,
          approvalHRDate: request.approvalHRDate,
          status: request.status,
          description: request.description
        }
        return leaverequest;
      })
      .catch(this.handleError);
  }


  public approvedLeaveRequestByHR(leave: LeaveRequest): Observable<LeaveRequest> {
    return this.http.put(API_URL + '/api/leaverequest/' + leave.id + '/changestatus/approved/hr', leave)
      .map(response => {
        const request = response.json();
        const leaverequest: LeaveRequest = {
          id: request.id,
          personId: request.personId,
          typeAbsence: request.typeAbsence,
          leaveFrom: request.leaveFrom,
          leaveTo: request.leaveTo,
          daysTaken: request.daysTaken,
          requestDate: request.requestDate,
          approvalManagerDate: request.approvalManagerDate,
          approvalHRDate: request.approvalHRDate,
          status: request.status,
          description: request.description
        }
        return leaverequest;
      })
      .catch(this.handleError);
  }


  public rejectedLeaveRequest(leave: LeaveRequest): Observable<LeaveRequest> {
    return this.http.put(API_URL + '/api/leaverequest/' + leave.id + '/changestatus/rejected', leave)
      .map(response => {
        const request = response.json();
        const leaverequest: LeaveRequest = {
          id: request.id,
          personId: request.personId,
          typeAbsence: request.typeAbsence,
          leaveFrom: request.leaveFrom,
          leaveTo: request.leaveTo,
          daysTaken: request.daysTaken,
          requestDate: request.requestDate,
          approvalManagerDate: request.approvalManagerDate,
          approvalHRDate: request.approvalHRDate,
          status: request.status,
          description: request.description
        }
        return leaverequest;
      })
      .catch(this.handleError);
  }


  private handleError (error: Response | any) {
    console.error('ApiLeaveRequestService::handleError', error);
    return Observable.throw(error);
  }

}
