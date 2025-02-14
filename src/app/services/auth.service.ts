import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());


  private apiUrl = 'http://localhost:8081/api/public'; 

  constructor(private http: HttpClient) {}


  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, user);
  }

  test(): Observable<any> {
    return this.http.get('http://localhost:8081/api/test');
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      return Date.now() >= decoded.exp * 1000;
    } catch (error) {
      console.error('Erreur de décodage du token :', error);
      return true; // Considérer le token comme expiré en cas d'erreur
    }
  }


  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }
}
