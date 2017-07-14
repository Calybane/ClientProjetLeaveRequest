import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {Person} from './model/person';
import {MenuItem} from 'primeng/primeng';
import {SharedDataService} from './service/shared-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {

  title: string = 'app';
  person: Person = new Person(3);

  // items: MenuItem[];

  constructor(private router: Router, private sharedData: SharedDataService) {}

  ngOnInit() {
    this.sharedData.setPerson(new Person(3));

    // TODO : a retirer en prod
      this.sharedData.person.daysLeft = 29;


    /*
    this.items = [
      {label: 'Home',  icon: 'fa-plus', command: (click) => {this.router.navigate(['home'])}},
      {label: 'Create vacation demand', icon: 'fa-download', command: (click) => {this.router.navigate(['demand'])}},
    ];
    */
  }

}


