import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { Http, Response } from '@angular/http';
import { Person } from '../model/person';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = environment.apiUrl;

@Injectable()
export class ApiPersonService {

  constructor(private http: Http) {
  }

  public getAllPerson(): Observable<Person[]> {
    return this.http.get(API_URL + '/persons')
                    .map(response => {  const persons = response.json();
                                        return persons.map((person) => new Person(person));
                    })
                    .catch(this.handleError);
  }

  public createPerson(person: Person): Observable<Person> {
    return this.http.post(API_URL + '/persons', person)
                    .map(response => new Person(response.json()))
                    .catch(this.handleError);
  }

  public getPersonById(personId: number): Observable<Person> {
    return this.http.get(API_URL + '/persons/' + personId)
                    .map(response => new Person(response.json()))
                    .catch(this.handleError);
  }

  public updatePerson(person: Person): Observable<Person> {
    return this.http.put(API_URL + '/persons/' + person.id, person)
                    .map(response => new Person(response.json()))
                    .catch(this.handleError);
  }

  public deletePersonById(personId: number): Observable<null> {
    return this.http.delete(API_URL + '/persons/' + personId)
                    .map(response => null)
                    .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    console.error('ApiPersonService::handleError', error);
    return Observable.throw(error);
  }

}
