import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
export interface Place {
  id: number | null;
  name: string;
  description?: string;
  images?: { path: string }[];  
  address?: string;
  latitude?: number;
  longitude?: number;
  averageRating?: number;
  userId: number;
  category: {  
    id: number | null;
    name: string;
  };
  user:{
    id: number;
    username: string;
    email: string;
    description: string;
    profilePicture:string

  }
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
  createPlace(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }
  
  // updatePlace(id: number, formData: FormData): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${id}`, formData);
  // }

  updatePlace(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData, {
      headers: {
        // Ensure the Content-Type is set correctly
        'Accept': 'application/json',
      },
    });
  }
  deletePlace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}