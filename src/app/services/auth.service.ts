import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

import { tap } from 'rxjs/operators'; 


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  private loggedIn = new BehaviorSubject<boolean>(false); 

  private role: string = '';

  private apiUrl = 'http://localhost:8081/api/public'; 

  constructor(private http: HttpClient ,  private router: Router) {}
 




  private hasToken(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('yes', token);
      const decoded: any = jwtDecode(token);
      console.log('decoded', decoded);
      this.role = decoded.role;  
      console.log('role', this.role);
      return true;
    }
    return false;
  }
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }



  login(user: any): Observable<any> {
  return this.http.post<{ token: string }>(`${this.apiUrl}/login`, user).pipe(
    tap((response) => {
      if (response.token) {  
        localStorage.setItem('token', response.token);
        this.isAuthenticated.next(true);  
      }
    })
  );
}

  



  getRole(): string {
    return this.role;
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

  logout(): void {
    
    localStorage.removeItem('token');
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }
}
