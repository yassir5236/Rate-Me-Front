import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/public/user';

  constructor(private http: HttpClient) {}



  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  updateUserProfile(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  
    return this.http.put(`${this.apiUrl}/update`, formData, { headers });
  }

  getUserById(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.get(`${this.apiUrl}/${userId}`, { headers });
  }
  
}
