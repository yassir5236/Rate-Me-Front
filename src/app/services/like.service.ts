// like.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LikeRequestDTO } from './../models/like.model';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private apiUrl = 'http://localhost:8081/api/likes';

  constructor(private http: HttpClient) {}

  toggleLike(likeRequestDTO: LikeRequestDTO): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/toggle`,
      likeRequestDTO
    );
  }

  getLikedPlaces(userId: number | null): Observable<number[]> {
    if (userId === null) {
      return throwError(() => new Error('User ID cannot be null'));
    }
    return this.http.get<number[]>(`${this.apiUrl}/user/${userId}`); // Récupère les places likées pour un utilisateur
  }

  // like.service.ts

  getLikesCountForEachPlace(): Observable<Map<number, number>> {
    return this.http.get<Map<number, number>>(`${this.apiUrl}/places/likes`);
  }
}
