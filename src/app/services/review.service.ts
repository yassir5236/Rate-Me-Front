import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8081/api/reviews';

  constructor(private http: HttpClient) {}

  getReviewsByPlaceId(placeId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/byPlace?placeId=${placeId}`);
  }


  createReview(reviewData: any): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, reviewData);
  }

  updateReview(reviewId: number, reviewData: any): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${reviewId}`, reviewData);
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}`);
  }
}