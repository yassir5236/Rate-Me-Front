import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8081/api/statistics';

  constructor(private http: HttpClient) {}

  getStatistics(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(this.apiUrl);
  }
  getPlacesGrowth(): Observable<{ labels: string[]; data: number[] }> {
    return this.http.get<{ labels: string[]; data: number[] }>(`${this.apiUrl}/places-growth`);
  }
}
