import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-selected-user',
  templateUrl: './selected-user.component.html',
  styleUrls: ['./selected-user.component.css'],
})
export class SelectedUserComponent implements OnInit {
  userId: number | null = null;
  user: any = null; // Replace 'any' with a proper User interface

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Get the user ID from the route parameters
    this.route.params.subscribe((params) => {
      this.userId = +params['userId']; // Convert to number
      this.fetchUserData();
    });
  }

  fetchUserData(): void {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(
        (data) => {
          this.user = data;
          console.log('User Data:', this.user);
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    }
  }
}