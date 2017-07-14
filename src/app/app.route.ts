import { Routes } from '@angular/router';
import { LeaveRequestComponent } from './widget/LeaveRequest/leave-request.component';
import { HomeComponent } from './widget/home/home.component';


export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/demand',
    pathMatch: 'full'
  },
  {
    path: 'demand',
    component: LeaveRequestComponent
  },
  {
    path: 'home',
    component: HomeComponent
  }
];
