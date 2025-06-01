import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieDataService {
    private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMovieData(title: string, year: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/user?title=${encodeURIComponent(title)}&year=${encodeURIComponent(year)}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    return throwError(error);
  }
}
