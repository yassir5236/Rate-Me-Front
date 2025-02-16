import { Component, OnInit } from '@angular/core';
import {  UserService } from '../services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isEditing = false;
  profileImage: string | null = null;
  file!: File;
  userName : string='';


  constructor(private userService: UserService, private fb: FormBuilder,    private sanitizer: DomSanitizer
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
      console.log(data)
   

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
          this.profileImage = updatedUser.profilePicture; // Mettre à jour l'image
          this.isEditing = false;
        },
        (error) => {
          console.error('Erreur:', error);
        }
      );
    }
  }}