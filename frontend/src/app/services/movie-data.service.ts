import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieDataService {
  /* private apiUrl = 'http://localhost:3000/search-movie'; */
  private apiUrl = 'https://api.storylinematch.com/search-movie';

  constructor(private http: HttpClient) {}

  getMovieData(title: string, year: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?title=${encodeURIComponent(title)}&year=${encodeURIComponent(year)}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    // Manejo personalizado de errores
    return throwError(error);
  }
}
