import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FavoriteMoviesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  postFavoriteMovie(title: string, movieData: any): Observable<any> {
    const endpoint = `${this.apiUrl}/api/user/insert-favorite-movie`;
    const body = {
      title: title,
      movieData: movieData
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.post(endpoint, body, { headers: headers });
  }

  getFavoriteMovies(): Observable<any> {
    const endpoint = `${this.apiUrl}/api/user/get-favorite-movies`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get(endpoint, { headers: headers });
  }

  deleteFavoriteMovie(title: string): Observable<any> {
    const endpoint = `${this.apiUrl}/api/user/delete-favorite-movie/${encodeURIComponent(title)}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.delete(endpoint, { headers: headers });
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}