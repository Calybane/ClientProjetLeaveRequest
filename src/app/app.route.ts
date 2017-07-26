import { Routes } from '@angular/router';
import { LeaveRequestComponent } from './widget/leaveRequest/leave-request.component';
import { ListRequestsComponent } from './widget/listRequests/list-requests.component';
import { RequestsApprobationComponent } from './widget/requestsApprobation/requests-approbation.component';
import { HomeComponent } from './widget/home/home.component';
import { SigninComponent } from './widget/signin/signin.component';
import { AuthGuard } from './app.authGuard';

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'request',
    component: LeaveRequestComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'list',
    component: ListRequestsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'approval',
    component: RequestsApprobationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'signin',
    component: SigninComponent
  }
];
