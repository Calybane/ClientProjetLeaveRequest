export class Person {
  id: number;
  lastname: string;
  firstname: string;
  daysLeft: number;

  constructor(id: number) {
    this.id = id;
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
