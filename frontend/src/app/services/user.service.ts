import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    /* return this.http.post<any>('http://localhost:3000/login', { email, password }).pipe( */
    return this.http.post<any>('https://api.storylinematch.com/login', { email, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token); // Almacena el token
        this.isAuthenticatedSubject.next(true); // Actualiza el estado de autenticación
      })
    );
  }

  getUserInfo(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    /* return this.http.get<any>('http://localhost:3000/user-info', { headers }); */
    return this.http.get<any>('https://api.storylinematch.com/user-info', { headers });
  }

  requestPasswordReset(email: string) {
/*     return this.http.post('http://localhost:3000/request-reset-password', { email }); */
    return this.http.post('https://api.storylinematch.com/request-reset-password', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
/*     return this.http.post<any>('http://localhost:3000/reset-password', { token, newPassword }); */
    return this.http.post<any>('https://api.storylinematch.com/reset-password', { token, newPassword });
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
