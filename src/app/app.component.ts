import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {Person} from './model/person';
import {SharedService} from './service/shared.service';

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

  constructor(private router: Router, private sharedService: SharedService) {}

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.sharedService.getRoles();
    }
  }

}


