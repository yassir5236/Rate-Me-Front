import { Component, OnInit } from '@angular/core';
import {  UserService } from '../services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ShareService } from '../services/share.service';
import { Router } from '@angular/router';
import { ReviewComponent } from '../review/review.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule,CommonModule,ReviewComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isEditing = false;
  profileImage: string | null = null;
  file!: File;
  userName : string='';
  sharedPlaces: any[] = []; // Array to store shared places
  


  showGallery = false;
  currentGallery: string[] = [];
  
    currentUserId: string | null = null;
    currentUserId2: number | null = null;
    showReviewForPlaceId: number = -1;
    currentUserName: string | null = null;
  

  

  constructor(private userService: UserService, private fb: FormBuilder, 
     private sanitizer: DomSanitizer , private shareService :ShareService,private router: Router,private toastr : ToastrService
) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      location: ['', Validators.required],
      // profilePicture: ['', Validators.required],
      bio: ['', Validators.required],
      
   
    });

      this.userService.getUserProfile().subscribe(data => {
        this.profileForm.patchValue(data);
        this.profileImage = data.profilePicture;
        this.userName=data.username;

        this.shareService.getSharesByUserId(data.id).subscribe(
          (shares) => {
            this.sharedPlaces = shares;
            console.log('Shared Places:', this.sharedPlaces);
          },
          (error) => {
            console.error('Error fetching shared places:', error);
          }
        );
  
    

        if (!data.location || !data.profilePicture || !data.bio) {
          this.isEditing = true; // Forcer la complétion du profil si des champs sont vides
        }
      });
    }


    onFileSelected(event: any): void {
      const file: File = event.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // Vérification taille max 5MB
          alert('La taille du fichier ne doit pas dépasser 5MB');
          return;
        }
        this.file = file;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.profileImage = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string) as string;
        };
      }
    }
    updateProfile() {
      if (this.profileForm.valid) {
        const formData = new FormData();
        formData.append('location', this.profileForm.get('location')?.value);
        formData.append('bio', this.profileForm.get('bio')?.value);
    
        if (this.file) {
          formData.append('profilePicture', this.file);
        }
    
        this.userService.updateUserProfile(formData).subscribe(
          (updatedUser) => {
            this.profileForm.patchValue(updatedUser);
            this.toastr.success('Profile updated successfully !');

            this.profileImage = updatedUser.profilePicture;
            this.isEditing = false;
          },
          (error) => {
            this.toastr.error('Wrong inputs!');

            console.error('Erreur:', error);
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
  
    
  ToUserData(userId: number |undefined) {
    this.router.navigate(['/selectedUser', userId]); // Pass the user ID as a route parameter
  }
  
  
  
  }




















