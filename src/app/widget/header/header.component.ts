import {Component, OnInit, Input} from '@angular/core';
import {Person} from '../../model/person';
import {PersonDataService} from '../../service/person-data.service';
import {AuthenticationService} from '../../service/authentication.service';
import {SharedService} from '../../service/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  person: Person = new Person();

  constructor(private personService: PersonDataService,
              private authService: AuthenticationService,
              private sharedService: SharedService) { }

  ngOnInit() {
    // TODO : remove when we can get the role of a user
    if (localStorage.getItem('token')) {
      this.personService.getPersonById(1).subscribe((person) => {
        this.person = person;
      });
    }
  }

  logout() {
    this.authService.logout();
  }

  isPageSignIn(): boolean {
    return this.sharedService.pageSignin;
  }

}
