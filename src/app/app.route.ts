import { Routes } from '@angular/router';
import { LeaveRequestComponent } from './widget/leaveRequest/leave-request.component';
import { ListRequestsComponent } from './widget/listRequests/list-requests.component';
import { RequestsApprobationComponent } from './widget/requestsApprobation/requests-approbation.component';
import { HomeComponent } from './widget/home/home.component';


export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/request',
    pathMatch: 'full'
  },
  {
    path: 'request',
    component: LeaveRequestComponent
  },
  {
    path: 'list',
    component: ListRequestsComponent
  },
  {
    path: 'approval',
    component: RequestsApprobationComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
];
