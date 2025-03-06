import { Component, OnInit, HostListener, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Place, PlaceService } from '../services/place.service';
import { Category, CategoryService } from '../services/category.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { ReviewComponent } from '../review/review.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ShareService } from '../services/share.service';
import { ShareRequestDTO } from '../models/share.model';
import { SharePopupComponent } from '../share-popup/share-popup.component';
import { ToastrService } from 'ngx-toastr';
import { LikesState } from '../store/reducers/likes.reducer';
import { Store } from '@ngrx/store';
import { likePlace, unlikePlace } from '../store/actions/likes.actions';
import { LikeService } from '../services/like.service';
import { Observable, of } from 'rxjs';
import { LikeRequestDTO } from './../models/like.model';

interface ImageFile {
  file: File;
  url: SafeUrl;
}

@Component({
  selector: 'app-place-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReviewComponent,
    FormsModule,
    SharePopupComponent,
  ],
  templateUrl: './place-management.component.html',
  styleUrls: ['./place-management.component.css'],
})
export class PlaceManagementComponent implements OnInit {
  selectedImages: ImageFile[] = [];
  places: Place[] = [];
  categories: Category[] = [];

  currentUserId: string | null = null;
  currentUserId2: number | null = null;
  showReviewForPlaceId: number = -1;
  currentUserName: string | null = null;

  profilePicture: string | null = null;
  placeForm!: FormGroup;
  showForm = false;
  pic: string[] = [];
  isDropdownOpen: boolean = false;

  filteredPlaces: Place[] = [];
  searchQuery: string = '';
  selectedCategory: Category | null = null;

  showSharePopup: boolean = false;
  selectedPlace: Place | null = null;

  currentUserRole: string | null = null;

  isLikedMap: { [placeId: number ]: boolean } = {};

  private store = inject(Store<{ likes: { likedPlaces: number[] } }>);
  private likeService = inject(LikeService);

  likedPlaces = signal<number[]>([]);

  constructor(
    private fb: FormBuilder,
    private placeService: PlaceService,
    private categoryService: CategoryService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private shareService: ShareService,
    private toastr: ToastrService
  ) {}

  openSharePopup(place: Place): void {
    this.selectedPlace = place;
    this.showSharePopup = true;
  }

  onSharePlace(title: string): void {
    if (this.selectedPlace) {
      const shareRequest: ShareRequestDTO = {
        userId: this.currentUserId ? Number(this.currentUserId) : 0,
        placeId: this.selectedPlace.id,
        title: title || '',
      };

      this.shareService.createShare(shareRequest).subscribe(
        (response) => {
          console.log('Place shared successfully:', response);
          this.toastr.success('Place shared successfully');
          this.showSharePopup = false;
        },
        (error) => {
          this.toastr.error('Wrong when sharing this post');
          console.error('Error sharing place:', error);
        }
      );
    }
  }

  onCancelShare(): void {
    this.showSharePopup = false;
  }

  ngOnInit(): void {
    this.getPlaces();
    this.getCategories();
    this.initForm();
    this.getCurrentUser();
    this.searchPlaces();

    this.store
      .select((state) => state.likes.likedPlaces)
      .subscribe((liked) => {
        this.likedPlaces.set(liked);
      });

      this.placeService.getAllPlaces().subscribe((data) => {
        // this.places = data; // Assign the fetched places to the `places` array
        // this.places.forEach((place) => {
        //   if (place.id !== null && place.id !== undefined) { // Ensure `id` is valid
        //     this.isLiked(place.id).subscribe((hasLiked) => {
        //       this.isLikedMap[place.id!] = hasLiked; // `!` ensures it's not null
        //     });
        //   } else {
        //     console.warn('Skipping place with invalid ID:', place);
        //   }
        // });
      });
      
   
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  searchPlaces(): void {
    this.filteredPlaces = this.places.filter((place) => {
      const matchesName = place.name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchesDescription = place.description
        ?.toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory
        ? place.category.id === this.selectedCategory.id
        : true;

      return (matchesName || matchesDescription) && matchesCategory;
    });
  }

  selectCategory(category: Category | null): void {
    this.selectedCategory = category;
    this.isDropdownOpen = false;
    // this.isDropdownOpen=true;
    this.searchPlaces();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownMenu = document.getElementById('dropdown');

    if (
      this.isDropdownOpen &&
      dropdownButton &&
      dropdownMenu &&
      !dropdownButton.contains(target) &&
      !dropdownMenu.contains(target)
    ) {
      this.isDropdownOpen = false;
    }
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.selectedCategory = null;
    this.filteredPlaces = this.places;
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

  initForm() {
    this.placeForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: [''],
      address: [''],
      latitude: [null],
      longitude: [null],
      averageRating: [null],
      categoryId: [null, Validators.required],
      userId: [null, Validators.required],
    });
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          alert(`La taille du fichier "${file.name}" ne doit pas dépasser 5MB`);
          continue;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.selectedImages.push({
            file,
            url: this.sanitizer.bypassSecurityTrustUrl(reader.result as string),
          });
        };
      }
    }
  }

  removeImage(image: ImageFile): void {
    this.selectedImages = this.selectedImages.filter((img) => img !== image);
  }

  savePlace(): void {
    if (!this.currentUserId) {
      console.error('User ID is missing. Cannot save place.');
      return;
    }

    this.placeForm.patchValue({ userId: this.currentUserId });

    if (this.placeForm.invalid) {
      console.log('Form Values:', this.placeForm.value);
      console.log('Form Validity:', this.placeForm.valid);
      console.log('Form Errors:', this.placeForm.errors);
      return;
    }

    const formData = new FormData();
    const placeData = this.placeForm.value;

    formData.append('place', JSON.stringify(placeData));

    this.selectedImages.forEach((image, index) => {
      formData.append(`images`, image.file, image.file.name);
    });

    if (placeData.id) {
      this.placeService.updatePlace(placeData.id, formData).subscribe({
        next: () => {
          this.toastr.success('Lieu mis à jour avec succès !', 'Succès');
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating place:', error);
          this.toastr.error('Erreur lors de la mise à jour du lieu');
        },
      });
    } else {
      this.placeService.createPlace(formData).subscribe({
        next: (place) => {
          this.toastr.success('Lieu créé avec succès !');
          this.places.push(place);
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating place:', error);
          this.toastr.error('Erreur lors de la création du lieu');
        },
      });
    }
  }
  resetForm(): void {
    this.placeForm.reset();
    this.selectedImages = [];
    this.showForm = false;
  }

  getPlaces() {
    this.placeService.getAllPlaces().subscribe((data) => {
      this.places = data;
      this.filteredPlaces = data;

      console.log(
        this.places.forEach((place) => {
          if (place.user && place.user.profilePicture) {
          } else {
            console.log('Aucune photo de profil trouvée pour cet utilisateur.');
          }
        })
      );
    });
  }

  getCurrentUser() {
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        try {
          this.currentUserId = data.id;
          this.currentUserId2 = data.id;
          this.currentUserName = data.username;
          this.profilePicture = data.profilePicture;
          this.currentUserRole = data.role;
        } catch (error) {
          console.error("Erreur lors de l'analyse du JSON:", error);
        }
      },
      error: (err) => {
        console.error('Erreur HTTP:', err);
      },
    });
  }

  ToUserData(userId: number | undefined) {
    if (this.currentUserRole == 'USER' || this.currentUserRole == 'ADMIN') {
      this.router.navigate(['/selectedUser', userId]);
    }
  }

  getCategories() {
    this.categoryService.getAllCategories().subscribe(
      (data) => {
        this.categories = data;
        console.log('Categories Data:', data);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  openForm(place: Place | null = null) {
    if (place) {
      this.placeForm.patchValue({
        id: place.id,
        name: place.name,
        description: place.description,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        averageRating: place.averageRating,
        categoryId: place.category.id,
      });
    } else {
      this.placeForm.reset({
        id: null,
        name: '',
        description: '',
        address: '',
        latitude: null,
        longitude: null,
        averageRating: null,
        categoryId: null,
      });
    }
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  deletePlace(id: number) {
    this.placeService.deletePlace(id).subscribe(() => {
      this.getPlaces();
    });
    this.toastr.success('the post deteleted successfully');
  }

  showGallery = false;
  currentGallery: string[] = [];

  openGallery(images?: { path: string }[]) {
    this.currentGallery = images?.map((img) => img.path) ?? [];
    this.showGallery = true;
  }

  closeGallery() {
    this.showGallery = false;
  }

  toggleLike(placeId: number): void {
    if (this.currentUserId === null) {
      console.error('User ID is missing');
      return;
    }

    const userId = Number(this.currentUserId);
    if (isNaN(userId)) {
      console.error('Invalid User ID');
      return;
    }

    // likeRequestDTO : LikeRequestDTO = {
    //   userId: this.currentUserId ? Number(this.currentUserId) : 0,
    // placeId: this.selectedPlace.id,
    // }
    const likeRequestDTO: LikeRequestDTO = { userId, placeId };

    this.likeService.toggleLike(likeRequestDTO).subscribe({
        next: (response: string) => { // Ensure response is treated as a string
            console.log(response); // Log the response, should be like "Place liked successfully"
            if (response.includes('liked')) {  // Check if the response includes 'liked'
                this.store.dispatch(likePlace({ placeId }));
            } else {
                this.store.dispatch(unlikePlace({ placeId }));
            }
        },
        error: (err) => {
            console.error('Error toggling like:', err);
        },
    });
  }

  isLiked(placeId: number): Observable<boolean> {
    if (this.currentUserId === null) {
 
      return of(false);
    }

    return this.likeService.hasLiked(Number(this.currentUserId), placeId);
  }

//   toggleLike(userId: number | null, placeId: number): void {
//     if (userId === null) {
//         console.error('User ID is missing');
//         return;
//     }

//     const likeRequestDTO: LikeRequestDTO = { userId, placeId };

//     this.likeService.sendToggleLikeRequest(likeRequestDTO).subscribe({
//         next: (response: string) => {
//             console.log(response);
//             if (response.includes('liked')) {
//                 this.store.dispatch(likePlace({ placeId }));
//                 this.isLikedMap[placeId] = true; // Update like status
//             } else {
//                 this.store.dispatch(unlikePlace({ placeId }));
//                 this.isLikedMap[placeId] = false; // Update like status
//             }
//         },
//         error: (err) => {
//             console.error('Error toggling like:', err);
//         },
//     });
// }

// onLikeButtonClick(userId: number | null, placeId: number): void {
//   if (userId === null) {
//       console.error('User ID is missing');
//       return;
//   }
//   this.toggleLike(userId, placeId);
// }

//   isLiked(placeId: number | null): Observable<boolean> {
//     if (this.currentUserId === null) {
//       return of(false); // Return false if the user is not logged in
//     }
//     const userId = Number(this.currentUserId); // Convert to number
//     if (isNaN(userId)) {
//       return of(false); // Return false if the conversion fails
//     }
//     return this.likeService.hasLiked(userId, placeId);
//   }

//   getNumericUserId(): number | null {
//     return this.currentUserId ? Number(this.currentUserId) : null;
//   }
  
}
