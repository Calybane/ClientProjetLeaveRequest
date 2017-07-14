import { Injectable } from '@angular/core';
import { Person } from '../model/person';
import {environment} from 'environments/environment';

const API_URL = environment.apiUrl;

@Injectable()
export class SharedDataService {

  person: Person;

  constructor() {
  }

  getPersonId(): number {
    return this.person.getId();
  }

  getPersonDaysLeft(): number {
    return this.person.getDaysLeft();
  }

  getPerson(): Person {
    return this.person;
  }

  setPerson(person: Person): void {
    this.person = person;
  }

}
