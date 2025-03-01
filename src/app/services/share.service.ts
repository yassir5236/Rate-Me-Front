import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShareRequestDTO } from './../models/share.model';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private apiUrl = 'http://localhost:8081/api/shares';

  constructor(private http: HttpClient) {}

  createShare(shareRequest: ShareRequestDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}`, shareRequest);
  }

  getSharesByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }
}