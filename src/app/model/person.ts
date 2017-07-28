export class Person {
  id: number;
  lastname: string = '';
  firstname: string = '';
  daysLeft: number = 0;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

  getId(): number {
    return this.id;
  }

  getLastname(): string {
    return this.lastname;
  }

  getFirstname(): string {
    return this.firstname;
  }

  getDaysLeft(): number {
    return this.daysLeft;
  }

}
