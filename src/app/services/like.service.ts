// like.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LikeRequestDTO } from './../models/like.model';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private apiUrl = 'http://localhost:8081/api/likes'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) {}

  toggleLike(likeRequestDTO: LikeRequestDTO): Observable<any> {
    return this.http.post<string>(`${this.apiUrl}`, likeRequestDTO);
  }


  sendToggleLikeRequest(likeRequestDTO: LikeRequestDTO): Observable<any> {
    return this.http.post<string>(`${this.apiUrl}/toggle`, likeRequestDTO);
}
  // Vérifier si un utilisateur a liké un lieu
  hasLiked(userId: number, placeId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/has-liked/${userId}/${placeId}`
    );
  }

  getLikesByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
}




















// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { LikeRequestDTO } from './../models/like.model';

// @Injectable({
//   providedIn: 'root',
// })
// export class LikeService {
//   private apiUrl = 'http://localhost:8081/api/likes'; // Replace with your backend URL

//   constructor(private http: HttpClient) {}

//   // Renamed method to avoid conflict
//   sendToggleLikeRequest(likeRequestDTO: LikeRequestDTO): Observable<any> {
//     return this.http.post<string>(`${this.apiUrl}/toggle`, likeRequestDTO);
//   }

//   // Check if a user has liked a place
//   hasLiked(userId: number, placeId: number |null): Observable<boolean> {
//     return this.http.get<boolean>(`${this.apiUrl}/has-liked/${userId}/${placeId}`);
//   }

//   // Get likes by user ID
//   getLikesByUserId(userId: number): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
//   }




// }