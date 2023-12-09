import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieSearchComponent } from './components/movie-search/movie-search.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { RequestResetPasswordComponent } from './components/request-reset-password/request-reset-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
/*   { path: 'login', component: LoginComponent }, */
  { path: 'register', component: RegisterComponent },
  { path: 'email-verification', component: EmailVerificationComponent},
  { path: 'request-reset-password', component: RequestResetPasswordComponent},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'movie-list', component: MovieListComponent, canActivate: [AuthGuard] },
  { path: 'movie-search', component: MovieSearchComponent, canActivate: [AuthGuard] },
  { path: 'favorites', component:  FavoritesComponent, canActivate: [AuthGuard] },
  // Añadir rutas adicionales aquí
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
