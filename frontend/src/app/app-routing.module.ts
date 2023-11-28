import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* import { HomeComponent } from './pages/home/home.component'; */
/* import { LoginComponent } from './components/login/login.component'; */
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
/* import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component'; */

const routes: Routes = [
/*   { path: '', component: HomeComponent }, */
/*   { path: 'login', component: LoginComponent }, */
  { path: 'register', component: RegisterComponent },
  { path: 'user-profile', component: UserProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
