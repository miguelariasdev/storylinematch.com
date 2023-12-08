import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private authSubscription!: Subscription;

  constructor(private authService: UserService, private router: Router) {}

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticatedObservable.subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(['/movie-search']); // Redirige a movie-search si está autenticado
        } else {
          /* this.router.navigate(['/login']); */ // Redirige a login si no está autenticado
        }
      }
    );
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe(); // Limpieza para evitar fugas de memoria
  }
}