import { Component, OnInit, HostListener } from '@angular/core';
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
import { FormsModule } from '@angular/forms'; // <-- Add this import
import { Router } from '@angular/router';
import { ShareService } from '../services/share.service';
import { ShareRequestDTO } from '../models/share.model';
import { SharePopupComponent } from "../share-popup/share-popup.component";

interface ImageFile {
  file: File;
  url: SafeUrl;
}

@Component({
  selector: 'app-place-management',
  imports: [CommonModule, ReactiveFormsModule, ReviewComponent, FormsModule, SharePopupComponent],
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
  isDropdownOpen: boolean = false; // Track dropdown visibility

  filteredPlaces: Place[] = []; // For displaying search results
  searchQuery: string = '';
  selectedCategory: Category | null = null;

  showSharePopup: boolean = false; // Control popup visibility
  selectedPlace: Place | null = null; // Store the selected place for sharing

  constructor(
    private fb: FormBuilder,
    private placeService: PlaceService,
    private categoryService: CategoryService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private shareService: ShareService // Add the ShareService to the constructor
  ) {}

  openSharePopup(place: Place): void {
    this.selectedPlace = place;
    this.showSharePopup = true;
  }

  onSharePlace(title: string): void {
    if (this.selectedPlace) {
      const shareRequest: ShareRequestDTO = {
        userId: this.currentUserId ? Number(this.currentUserId) : 0, // Convert to number, use 0 as fallback
        placeId: this.selectedPlace.id,
        title: title || '', // Use the provided title or an empty string
      };
  
      this.shareService.createShare(shareRequest).subscribe(
        (response) => {
          console.log('Place shared successfully:', response);
          this.showSharePopup = false; // Close the popup
        },
        (error) => {
          console.error('Error sharing place:', error);
        }
      );
    }
  }
  

  onCancelShare(): void {
    this.showSharePopup = false; // Close the popup
  }

  ngOnInit(): void {
    this.getPlaces();
    this.getCategories();
    this.initForm();
    this.getCurrentUser();
    this.searchPlaces(); // Call searchPlaces to initialize filteredPlaces

    this.placeService.getAllPlaces().subscribe((data) => {
      // this.selectedImages = data.push
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Search functionality
  // Real-time search functionality
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

  // Select category from dropdown
  selectCategory(category: Category | null): void {
    this.selectedCategory = category;
    this.isDropdownOpen = false; // Close dropdown on selection
    // this.isDropdownOpen=true;
    this.searchPlaces();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownMenu = document.getElementById('dropdown');

    // Check if the click is outside both the button and the dropdown menu
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
      this.placeService.updatePlace(placeData.id, formData).subscribe(() => {
        this.resetForm();
      });
    } else {
      this.placeService.createPlace(formData).subscribe((place) => {
        this.places.push(place);
        this.resetForm();
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
        } catch (error) {
          console.error("Erreur lors de l'analyse du JSON:", error);
        }
      },
      error: (err) => {
        console.error('Erreur HTTP:', err);
      },
    });
  }


  ToUserData(userId: number |undefined) {
    this.router.navigate(['/selectedUser', userId]); // Pass the user ID as a route parameter
  }

  getCategories() {
    this.categoryService.getAllCategories().subscribe(
      (data) => {
        this.categories = data;
        console.log('Categories Data:', data); // Log the data to verify its structure
      },
      (error) => {
        console.error('Error fetching categories:', error); // Log any errors
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
}
