import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

  @Injectable({
    providedIn: 'root'
  })
  export class UserService {
    private apiUrl = environment.apiUrl;
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());

    constructor(private http: HttpClient) {}

    login(email: string, password: string) {

      return this.http.post<any>(`${this.apiUrl}/api/auth/login`, { email, password }).pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          this.isAuthenticatedSubject.next(true);
        })
      );
    }

    getUserInfo(): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      return this.http.get<any>(`${this.apiUrl}/api/user/info`, { headers });
    }

    requestPasswordReset(email: string) {
      return this.http.post(`${this.apiUrl}/api/auth/request-reset-password`, { email });
    }

    resetPassword(token: string, newPassword: string): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/api/auth/reset-password`, { token, newPassword });
    }

    isAuthenticated(): boolean {
      return !!localStorage.getItem('token');
    }

    get isAuthenticatedObservable() {
      return this.isAuthenticatedSubject.asObservable();
    }

    logout() {
      localStorage.removeItem('token');
      this.isAuthenticatedSubject.next(false);
    }
  }
