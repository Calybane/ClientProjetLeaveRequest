import {Injectable, OnInit} from '@angular/core';
import {environment} from 'environments/environment';

const API_URL = environment.apiUrl;

@Injectable()
export class SharedDataService {

  typeAbsence: Map<string, string>;

  constructor() {
    this.typeAbsence = new Map<string, string>();
    this.typeAbsence.set('Annual leave', 'Annual leave');
    this.typeAbsence.set('Special leave', 'Special leave *');
  }

}
