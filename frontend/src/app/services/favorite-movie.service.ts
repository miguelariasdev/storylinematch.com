import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteMoviesService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  postFavoriteMovie(title: string, movieData: any): Observable<any> {
    const endpoint = `${this.apiUrl}/insert-favorite-movie`;
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
    const endpoint = `${this.apiUrl}/get-favorite-movies`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
  
    return this.http.get(endpoint, { headers: headers });
  }

  deleteFavoriteMovie(title: string): Observable<any> {
    const endpoint = `${this.apiUrl}/delete-favorite-movie/${encodeURIComponent(title)}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.delete(endpoint, { headers: headers });
}

  private getToken(): string {
    // Obtiene el token JWT almacenado en el cliente
    return localStorage.getItem('token') || '';
  }
}