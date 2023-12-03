import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<any>('http://localhost:3000/login', { username, password }).pipe(
    /* return this.http.post<any>('https://api.storylinematch.com/login', { username, password }).pipe( */
      tap(res => {
        localStorage.setItem('token', res.token); // Almacena el token
        this.isAuthenticatedSubject.next(true); // Actualiza el estado de autenticación
      })
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  get isAuthenticatedObservable() {
    return this.isAuthenticatedSubject.asObservable();
  }

  logout() {
    localStorage.removeItem('token'); // Elimina el token
    this.isAuthenticatedSubject.next(false); // Actualiza el estado de autenticación
  }
}
