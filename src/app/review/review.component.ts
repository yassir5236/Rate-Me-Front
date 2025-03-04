import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Review } from '../models/review.model';
import { ReviewService } from '../services/review.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent implements OnInit {
  @Input() placeId: number = 0; 
  reviews: Review[] = [];
  reviewForm: FormGroup; 
  isEditing = false; 
  currentReviewId: number | null = null; 
  userId: number = 0;
  currentUserRole : string |null = null;

  constructor(
    private reviewService: ReviewService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.reviewForm = this.fb.group({
      comment: ['', Validators.required],
      rating: [null, [ Validators.min(1), Validators.max(5)]],
    });
  }

  ngOnInit(): void {
    this.loadReviews(); 
    this.getCurrentUser();
    this.userService.getUserProfile().subscribe((user) => {
      this.userId = user.id; 
    });
  }

  loadReviews(): void {
    if (this.placeId) {
      this.reviewService.getReviewsByPlaceId(this.placeId).subscribe((reviews) => {
        this.reviews = reviews;
      });
    } else {
      console.error('placeId is not defined');
    }
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) return;

    const reviewData = {
      ...this.reviewForm.value,
      placeId: this.placeId,
      userId: this.userId, 
    };

    if (this.isEditing && this.currentReviewId) {
      this.reviewService.updateReview(this.currentReviewId, reviewData).subscribe(() => {
        this.loadReviews();
        this.resetForm();
      });
    } else {
      this.reviewService.createReview(reviewData).subscribe(() => {
        this.loadReviews();
        this.resetForm();
      });
    }
  }

  onEdit(review: Review): void {
    this.isEditing = true;
    this.currentReviewId = review.id;
    this.reviewForm.patchValue({
      comment: review.comment,
      rating: review.rating,
    });
  }

  onDelete(reviewId: number): void {
    this.reviewService.deleteReview(reviewId).subscribe(() => {
      this.loadReviews();
    });
  }

  resetForm(): void {
    this.reviewForm.reset();
    this.isEditing = false;
    this.currentReviewId = null;
  }

  getCurrentUser() {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        try {

          this.currentUserRole=data.role;
        } catch (error) {
          console.error("Erreur lors de l'analyse du JSON:", error);
        }
      },
      error: (err) => {
        console.error('Erreur HTTP:', err);
      },
    });
}
}