import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  /* private apiUrl = 'http://localhost:3000/generate-response'; */
  private apiUrl = 'https://api.storylinematch.com/generate-response';

  constructor(private http: HttpClient) {}

  generateResponse(prompt: string) {
    return this.http.post<any>(this.apiUrl, { prompt }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    // Manejo personalizado de errores
    return throwError(error);
  }
}
