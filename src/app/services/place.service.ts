import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Place {
  id: number | null;
  name: string;
  description?: string;
  photo?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  averageRating?: number;
  category: {  // Nested category object to match backend response
    id: number | null;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private apiUrl = 'http://localhost:8081/api/places';

  constructor(private http: HttpClient) {}

  getAllPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(this.apiUrl);
  }

  getPlaceById(id: number): Observable<Place> {
    return this.http.get<Place>(`${this.apiUrl}/${id}`);
  }

  createPlace(place: Partial<Place>): Observable<Place> {
    return this.http.post<Place>(this.apiUrl, place);
  }

  updatePlace(id: number, place: Partial<Place>): Observable<Place> {
    return this.http.put<Place>(`${this.apiUrl}/${id}`, place);
  }

  deletePlace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}