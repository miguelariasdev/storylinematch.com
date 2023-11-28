import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor() { }

  login(): void {
    // Implementa el login
    this.isAuthenticated.next(true);
  }

  logout(): void {
    // Implementa el logout
    this.isAuthenticated.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }
  
}
