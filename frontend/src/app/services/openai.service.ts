import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  generateResponse(prompt: string) {
    return this.http.post<any>(`${this.apiUrl}/generate-response`, { prompt }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    return throwError(error);
  }
}
