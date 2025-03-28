import { Component, OnInit, HostListener, inject, signal, ViewChild } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
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
import { NgxPaginationModule } from 'ngx-pagination';
import { MapComponent } from '../map/map.component';


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
    NgxPaginationModule,
    MapComponent
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

  isLikedMap: { [placeId: number]: boolean } = {};

  private store = inject(Store<{ likes: { likedPlaces: number[] } }>);
  private likeService = inject(LikeService);

  likedPlaces = signal<number[]>([]);
  likesCountMap: Map<number, number> = new Map(); 
  page: number = 1; 
  itemsPerPage: number = 5; 
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  currentPlace: Partial<Place> = {
    latitude: 48.8566, 
    longitude: 2.3522
  };

  constructor(
    private fb: FormBuilder,
    private placeService: PlaceService,
    private categoryService: CategoryService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private shareService: ShareService,
    private toastr: ToastrService,
    private route: ActivatedRoute
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
    this.places = this.route.snapshot.data['places'];
    this.currentGallery = this.places.flatMap(place => place.images?.map(img => img.path) || []);
    this.getPlaces();
    this.getCategories();
    this.initForm();
    this.getCurrentUser();
    this.searchPlaces();
    this.loadLikedPlaces(); 
    this.loadLikesCount();
  
   
    this.store
      .select((state) => state.likes.likedPlaces)
      .subscribe((liked) => {
        this.likedPlaces.set(liked);
      });

    this.placeService.getAllPlaces().subscribe((data) => {});
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
  
    if (this.selectedImages.length < 2) {
      this.toastr.error('Vous devez télécharger au moins 2 images.');
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
  
    // Ajouter les données de localisation au formulaire
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
          this.getPlaces();
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
          this.loadLikedPlaces();

          console.log(data.id);
          console.log(this.currentUserId)
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

  ToUserData(userId: number ) {
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
    setTimeout(() => {
      this.mapComponent.initMap();
    }, 0);
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



  loadLikedPlaces(): void {
    if (!this.currentUserId || isNaN(+this.currentUserId)) {
      console.warn('User ID is null or invalid, skipping request to load liked places');
      return; // Si l'ID utilisateur est null ou invalide, on arrête ici
    }
  
    this.likeService.getLikedPlaces(+this.currentUserId).subscribe((places: number[]) => {
      this.likedPlaces.set(places);
      console.log('Places liked:', places);
    });
  }
  
  
  createLike(placeId: number): void {
    if (this.currentUserId === null) {
      console.error('User ID is missing');
      this.router.navigate(['/login'])
      return;
    }

    const userId = Number(this.currentUserId);
    if (isNaN(userId)) {
      console.error('Invalid User ID');
      return;
    }

    const likeRequestDTO: LikeRequestDTO = { userId, placeId };

    this.likeService.toggleLike(likeRequestDTO).subscribe({
      next: (response) => {
        this.loadLikedPlaces();
        this.loadLikesCount();
        console.log(response.message);
        if (response.message === 'liked') {
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

  loadLikesCount(): void {
    this.likeService.getLikesCountForEachPlace().subscribe({
      next: (countMap) => {
        this.likesCountMap = new Map(
          Object.entries(countMap).map(([key, value]) => [Number(key), value])
        );
        console.log('Likes count for each place:', this.likesCountMap);
      },
      error: (err) => {
        console.error('Error fetching likes count for each place:', err);
      },
    });
  }

  onMapLocationSelected(event: { lat: number, lng: number }) {
    this.placeForm.patchValue({
      latitude: event.lat,
      longitude: event.lng
    });
  }

  onPlaceLocationChange(updatedPlace: Partial<Place>): void {
    this.placeForm.patchValue({
      latitude: updatedPlace.latitude,
      longitude: updatedPlace.longitude,
      address: updatedPlace.address,
    });
  
    this.currentPlace = { ...this.currentPlace, ...updatedPlace };
  }

  getDirections(latitude: number | undefined, longitude: number | undefined): void {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      window.open(url, '_blank'); 
    } else {
      this.toastr.error('Latitude or longitude is missing')
      console.error('Latitude or longitude is missing.');
    }
  }

}
