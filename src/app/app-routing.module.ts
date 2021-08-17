import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { ResultsComponent } from './vote/results/results.component';
import { VoteComponent } from './vote/vote/vote.component';
import { DetailsComponent } from './voter/details/details.component';
import { AuthGuard } from './_services/auth.guard';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'login',component: LoginComponent},
  {path:'register',component:RegisterComponent},
  {
    path:'vote',
    component:VoteComponent,
    canActivate: [AuthGuard]
  },
  {path:'me',component:DetailsComponent},
  {path: 'results',component:ResultsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
