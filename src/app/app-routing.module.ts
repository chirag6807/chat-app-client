import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CaseListComponent } from './case-list/case-list.component';
import { AuthGuard } from './authguard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: RegisterComponent
  },
  {
    path: 'chat',
    component: CaseListComponent,
    data: { title: 'List of Cases' }
   
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
