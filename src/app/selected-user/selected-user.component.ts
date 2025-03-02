// import { ActivatedRoute } from '@angular/router';
// import { Component, OnInit } from '@angular/core';
// import {  UserService } from '../services/user.service';
// import { ReactiveFormsModule } from '@angular/forms';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { DomSanitizer } from '@angular/platform-browser';
// import { ShareService } from '../services/share.service';
// import { Router } from '@angular/router';
// import { ReviewComponent } from '../review/review.component';

// @Component({
//   selector: 'app-selected-user',
//   imports:[ReactiveFormsModule,CommonModule,ReviewComponent],
//   templateUrl: './selected-user.component.html',
//   styleUrls: ['./selected-user.component.css'],
// })
// export class SelectedUserComponent implements OnInit {
//   userId: number | null = null;
//   user: any = null; // Replace 'any' with a proper User interface

//   profileForm!: FormGroup;
//   isEditing = false;
//   profileImage: string | null = null;
//   file!: File;
//   userName : string='';
//   sharedPlaces: any[] = []; // Array to store shared places
  


//   showGallery = false;
//   currentGallery: string[] = [];
  
//     currentUserId: string | null = null;
//     currentUserId2: number | null = null;
//     showReviewForPlaceId: number = -1;
//     currentUserName: string | null = null;
  

//   constructor(
//     private route: ActivatedRoute,
//     private userService: UserService,private shareService :ShareService,private router: Router
//   ) {}

//   ngOnInit(): void {
//     // Get the user ID from the route parameters
//     this.route.params.subscribe((params) => {
//       this.userId = +params['userId']; // Convert to number
//       this.fetchUserData();
//     });

//        this.shareService.getSharesByUserId(data.id).subscribe(
//           (shares) => {
//             this.sharedPlaces = shares;
//             console.log('Shared Places:', this.sharedPlaces);
//           },
//           (error) => {
//             console.error('Error fetching shared places:', error);
//           }
//         );
//   }

//   fetchUserData(): void {
//     if (this.userId) {
//       this.userService.getUserById(this.userId).subscribe(
//         (data) => {
//           this.user = data;
//           console.log('User Data:', this.user);
//         },
//         (error) => {
//           console.error('Error fetching user data:', error);
//         }
//       );
//     }
//   }






  
//   toggleReviewSection(placeId: number | null | undefined): void {
//     if (!placeId) {
//       console.error("L'ID du lieu est invalide ou manquant.");
//       return;
//     }

//     if (this.showReviewForPlaceId === placeId) {
//       this.showReviewForPlaceId = -1;
      
//     } else {
//       this.showReviewForPlaceId = placeId;
//     }
//   }


//   openGallery(images?: { path: string }[]) {
//     this.currentGallery = images?.map((img) => img.path) ?? [];
//     this.showGallery = true;
//   }

  
// ToUserData(userId: number |undefined) {
//   this.router.navigate(['/selectedUser', userId]); // Pass the user ID as a route parameter
// }

// }





import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ShareService } from '../services/share.service';
import { Router } from '@angular/router';
import { ReviewComponent } from '../review/review.component';

@Component({
  selector: 'app-selected-user',
  imports: [ReactiveFormsModule, CommonModule, ReviewComponent],
  templateUrl: './selected-user.component.html',
  styleUrls: ['./selected-user.component.css'],
})
export class SelectedUserComponent implements OnInit {
  userId: number | null = null;
  user: any = null; // Replace 'any' with a proper User interface

  profileForm!: FormGroup;
  isEditing = false;
  profileImage: string | null = null;
  file!: File;
  userName: string = '';
  sharedPlaces: any[] = []; // Array to store shared places

  showGallery = false;
  currentGallery: string[] = [];

  currentUserId: string | null = null;
  currentUserId2: number | null = null;
  showReviewForPlaceId: number = -1;
  currentUserName: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private shareService: ShareService,
    private router: Router
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

          // Fetch shared places after user data is fetched
          this.shareService.getSharesByUserId(this.user.id).subscribe(
            (shares) => {
              this.sharedPlaces = shares;
              console.log('Shared Places:', this.sharedPlaces);
            },
            (error) => {
              console.error('Error fetching shared places:', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    }
  }

  toggleReviewSection(placeId: number | null | undefined): void {
    if (!placeId) {
      console.error("L'ID du lieu est invalide ou manquant.");
      return;
    }

    if (this.showReviewForPlaceId === placeId) {
      this.showReviewForPlaceId = -1;
    } else {
      this.showReviewForPlaceId = placeId;
    }
  }

  openGallery(images?: { path: string }[]) {
    this.currentGallery = images?.map((img) => img.path) ?? [];
    this.showGallery = true;
  }

  ToUserData(userId: number | undefined) {
    if (userId) {
      this.router.navigate(['/selectedUser', userId]); // Pass the user ID as a route parameter
    }
  }
}