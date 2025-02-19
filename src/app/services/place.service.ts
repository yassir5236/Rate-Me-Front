// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { map, Observable } from 'rxjs';

// export interface Place {
//   id: number | null;
//   name: string;
//   description?: string;
//   photos?: string[]; // Ajouter ce champ
//   address?: string;
//   latitude?: number;
//   longitude?: number;
//   averageRating?: number;
//   category?: { // Rendre optionnel
//     id: number | null;
//     name: string;
//   };
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class PlaceService {
//   private apiUrl = 'http://localhost:8081/api/places';

//   constructor(private http: HttpClient) {}

//   getAllPlaces(): Observable<Place[]> {
//     return this.http.get<Place[]>(this.apiUrl);
//   }

//   getPlaceById(id: number): Observable<Place> {
//     return this.http.get<Place>(`${this.apiUrl}/${id}`);
//   }

//   createPlace(formData: FormData): Observable<any> {
//     return this.http.post(`${this.apiUrl}`, formData);
//   }

//   updatePlace(id: number, formData: FormData): Observable<any> {
//     return this.http.put(`${this.apiUrl}/${id}`, formData);
//   }

//   deletePlace(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`);
//   }
// }





import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
export interface Place {
  id: number | null;
  name: string;
  description?: string;
  images?: { path: string }[];  // <-- Tableau d'objets avec 'path'
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
  createPlace(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }
  
  updatePlace(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }
  deletePlace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}