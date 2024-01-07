import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  private apiUrl = 'https://78b2-2400-adc5-17b-5900-3d89-3f36-ca3f-2d24.ngrok-free.app'; // Replace with your backend API URL
  private clientId = 'tI3E3Y6Anet3M3M9FH115Vzswe_bQyYqmKWUOlDoj-c';
  private clientSecret = 'jWSPL_P3wXVJXnkmY39ANJ2Pct0ioes7u0MG3QWZqM0'

  constructor(private http: HttpClient) {}

  getClientId() {
    return this.clientId;
  }

  getClientSecret() {
    return this.clientSecret;
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }

    return throwError('Something bad happened; please try again later.');
  }

  get(endpoint: string): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': '69420'
    });

    // Include headers in the options object
    const options = { headers };
    return this.http.get(url, options).pipe(catchError(this.handleError));
  }

  getWithToken(endpoint: string, token: string) {
    const url = `${this.apiUrl}/${endpoint}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': '69420'
    });

    // Include headers in the options object
    const options = { headers };
    return this.http.get(url, options).pipe(catchError(this.handleError));
  }

  post(endpoint: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http.post(url, data).pipe(catchError(this.handleError));
  }

  patch(endpoint: string, body: any,  token: string): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    // Include headers in the options object
    const options = { headers };
    return this.http.patch(url, body, options).pipe(catchError(this.handleError));
  }

}
