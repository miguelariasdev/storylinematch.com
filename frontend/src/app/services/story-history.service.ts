import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoryHistoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  postStoryHistory(query: string, movieData: any): Observable<any> {
    const endpoint = `${this.apiUrl}/api/user/insert-story-history`;
    const body = {
      query: query,
      movies_data: movieData
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.post(endpoint, body, { headers: headers });
  }

  getStoryHistory(): Observable<any> {
    const endpoint = `${this.apiUrl}/api/user/get-story-history`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get(endpoint, { headers: headers });
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}