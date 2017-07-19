import {Component, OnInit, Input} from '@angular/core';
import {Person} from '../../model/person';
import {PersonDataService} from '../../service/person-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [PersonDataService]
})
export class HeaderComponent implements OnInit {

  person: Person = new Person();

  constructor(private personService: PersonDataService) { }

  ngOnInit() {
    this.personService.getPersonById(3).subscribe((person) => {
      this.person = person;
    });
  }

}
