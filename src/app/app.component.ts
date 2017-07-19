import {Component, OnInit, ViewEncapsulation, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Person} from './model/person';
import {SharedDataService} from './service/shared-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: []
})

export class AppComponent implements OnInit {

  title: string = 'PTL';
  person: Person;

  constructor(private router: Router, private sharedData: SharedDataService) {}

  ngOnInit() {
  }

}


