// import { Component, OnInit } from '@angular/core';
// import { Place, PlaceService } from '../services/place.service';
// import { Category, CategoryService } from '../services/category.service';
// import { CommonModule } from '@angular/common';
// import {
//   ReactiveFormsModule,
//   FormBuilder,
//   FormGroup,
//   Validators,
// } from '@angular/forms';

// @Component({
//   selector: 'app-place-management',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule], // Use ReactiveFormsModule
//   templateUrl: './place-management.component.html',
//   styleUrls: ['./place-management.component.css'],
// })
// export class PlaceManagementComponent implements OnInit {

  
//   places: Place[] = [];
//   categories: Category[] = [];
//   placeForm!: FormGroup;
//   showForm = false;
//   selectedImages: string[] = []; 

//   constructor(
//     private placeService: PlaceService,
//     private categoryService: CategoryService,
//     private fb: FormBuilder // Inject FormBuilder
//   ) {}

//   ngOnInit(): void {
//     this.getPlaces();
//     this.getCategories();
//     this.initForm(); // Initialize the form
//   }

//   // Initialize the form with all fields
//   initForm() {
//     this.placeForm = this.fb.group({
//       id: [null],
//       name: ['', Validators.required],
//       description: [''],
//       photo: [''],
//       address: [''],
//       latitude: [null],
//       longitude: [null],
//       averageRating: [null],
//       categoryId: [null, Validators.required], // Flat field for category ID
//     });
//   }

//   getPlaces() {
//     this.placeService.getAllPlaces().subscribe((data) => {
//       this.places = data;
//     });
//   }

//   getCategories() {
//     this.categoryService.getAllCategories().subscribe((data) => {
//       this.categories = data;
//     });
//   }

//   // Open the form for adding/editing
//   openForm(place: Place | null = null) {
//     if (place) {
//       // Populate the form with the selected place's data
//       this.placeForm.patchValue({
//         id: place.id,
//         name: place.name,
//         description: place.description,
//         photo: place.photo,
//         address: place.address,
//         latitude: place.latitude,
//         longitude: place.longitude,
//         averageRating: place.averageRating,
//         categoryId: place.category.id, // Map nested category to flat field
//       });
//     } else {
//       // Reset the form for a new place
//       this.placeForm.reset({
//         id: null,
//         name: '',
//         description: '',
//         photo: '',
//         address: '',
//         latitude: null,
//         longitude: null,
//         averageRating: null,
//         categoryId: null,
//       });
//     }
//     this.showForm = true;
//   }

//   closeForm() {
//     this.showForm = false;
//   }

//   // Save the place
//   savePlace() {
//     if (this.placeForm.invalid) {
//       return; // Don't proceed if the form is invalid
//     }

//     const placeRequest = this.placeForm.value; // Get the form values

//     if (placeRequest.id) {
//       // Update existing place
//       this.placeService
//         .updatePlace(placeRequest.id, placeRequest)
//         .subscribe(() => {
//           this.getPlaces();
//           this.closeForm();
//         });
//     } else {
//       // Create new place
//       this.placeService.createPlace(placeRequest).subscribe(() => {
//         this.getPlaces();
//         this.closeForm();
//       });
//     }
//   }

//   deletePlace(id: number) {
//     this.placeService.deletePlace(id).subscribe(() => {
//       this.getPlaces();
//     });
//   }

//   onFilesSelected(event: any): void {
//     const files: FileList = event.target.files;
//     if (files) {
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         if (file.size > 5 * 1024 * 1024) { // Limite de 5MB
//           alert(`L'image ${file.name} dépasse la taille maximale de 5MB`);
//           continue;
//         }
//         const reader = new FileReader();
//         reader.onload = () => {
//           this.images.push({ file, url: this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string) });
//         };
//         reader.readAsDataURL(file);
//       }
//     }
//   }

//     deletePlace(id: number) {
//     this.placeService.deletePlace(id).subscribe(() => {
//       this.getPlaces();
//     });
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Place, PlaceService } from '../services/place.service';
// import { Category, CategoryService } from '../services/category.service';
// import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
// import { CommonModule } from '@angular/common';

// interface ImageFile {
//   file: File;
//   url: SafeUrl;
// }

// @Component({
//   selector: 'app-place-management',
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './place-management.component.html',
//   styleUrls: ['./place-management.component.css']
// })
// export class PlaceManagementComponent implements OnInit {
//   selectedImages: ImageFile[] = []; // Store selected images
//   places: Place[] = [];
//   categories: Category[] = [];
//   placeForm!: FormGroup;
//   showForm = false;

//   constructor(
//     private fb: FormBuilder,
//     private placeService: PlaceService,
//     private categoryService: CategoryService,
//     private sanitizer: DomSanitizer
//   ) {}

//   ngOnInit(): void {
//     this.getPlaces();
//     this.getCategories();
//     this.initForm();
//   }

//   currentPlace: Place = {
//     id: null,
//     name: '',
//     photos: [],
//     category: undefined
//   };

//   initForm() {
//     this.placeForm = this.fb.group({
//       id: [null],
//       name: ['', Validators.required],
//       description: [''],
//       address: [''],
//       latitude: [null],
//       longitude: [null],
//       averageRating: [null],
//       categoryId: [null, Validators.required]
//     });
//   }

//   onFilesSelected(event: any): void {
//     const files: FileList = event.target.files;
//     if (files && files.length > 0) {
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         if (file.size > 5 * 1024 * 1024) { // Max file size: 5MB
//           alert(`La taille du fichier "${file.name}" ne doit pas dépasser 5MB`);
//           continue;
//         }
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => {
//           this.selectedImages.push({
//             file,
//             url: this.sanitizer.bypassSecurityTrustUrl(reader.result as string)
//           });
//         };
//       }
//     }
//   }

//   removeImage(image: ImageFile): void {
//     this.selectedImages = this.selectedImages.filter(img => img !== image);
//   }

//   savePlace(): void {
//     if (this.placeForm.invalid) {
//       return;
//     }

//     const formData = new FormData();
//     const placeData = this.placeForm.value;

//     // Append place data as a JSON string
//     formData.append('place', JSON.stringify(placeData));

//     // Append images to FormData
//     this.selectedImages.forEach((image, index) => {
//       formData.append(`images`, image.file, image.file.name);
//     });

//     console.log(formData)

//     if (placeData.id) {
//       // Update existing place
//       this.placeService.updatePlace(placeData.id, formData).subscribe(() => {
//         this.resetForm();
//       });
//     } else {
//       // Create new place
//       this.placeService.createPlace(formData).subscribe(() => {
//         this.resetForm();
//       });
//     }
//   }

//   resetForm(): void {
//     this.placeForm.reset();
//     this.selectedImages = [];
//     this.showForm = false;
//   }

//   getPlaces() {
//     this.placeService.getAllPlaces().subscribe(data => {
//       this.places = data;
//     });
//   }

//   getCategories() {
//     this.categoryService.getAllCategories().subscribe(data => {
//       this.categories = data;
//     });
//   }

//   openForm(place: Place | null = null) {
//     if (place) {
//       this.selectedImages = place.photos?.map(url => ({
//         url: url as unknown as SafeUrl,
//         file: new File([], url.split('/').pop()!)
//       })) || [];
//       this.placeForm.patchValue({
//         id: place.id,
//         name: place.name,
//         description: place.description,
//         address: place.address,
//         latitude: place.latitude,
//         longitude: place.longitude,
//         averageRating: place.averageRating,
//         categoryId: place.category?.id ?? null
//       });
//     } else {
//       this.placeForm.reset({
//         id: null,
//         name: '',
//         description: '',
//         address: '',
//         latitude: null,
//         longitude: null,
//         averageRating: null,
//         categoryId: null
//       });
//     }
//     this.showForm = true;
//   }

//   closeForm() {
//     this.showForm = false;
//   }

//   deletePlace(id: number) {
//     this.placeService.deletePlace(id).subscribe(() => {
//       this.getPlaces();
//     });
//   }
// }
















import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Place, PlaceService } from '../services/place.service';
import { Category, CategoryService } from '../services/category.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

interface ImageFile {
  file: File;
  url: SafeUrl;
}

@Component({
  selector: 'app-place-management',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './place-management.component.html',
  styleUrls: ['./place-management.component.css']
})
export class PlaceManagementComponent implements OnInit {
  selectedImages: ImageFile[] = []; // Store selected images
  places: Place[] = [];
  categories: Category[] = [];
  placeForm!: FormGroup;
  showForm = false;
  pic:string []=[];

  constructor(
    private fb: FormBuilder,
    private placeService: PlaceService,
    private categoryService: CategoryService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getPlaces();
    this.getCategories();
    this.initForm();

    

    this.placeService.getAllPlaces().subscribe(data=>{
      // this.selectedImages = data.push
    })
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
      categoryId: [null, Validators.required]
    });
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) { // Max file size: 5MB
          alert(`La taille du fichier "${file.name}" ne doit pas dépasser 5MB`);
          continue;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.selectedImages.push({
            file,
            url: this.sanitizer.bypassSecurityTrustUrl(reader.result as string)
          });
        };
      }
    }
  }

  removeImage(image: ImageFile): void {
    this.selectedImages = this.selectedImages.filter(img => img !== image);
  }

  savePlace(): void {
    if (this.placeForm.invalid) {
      return;
    }

    const formData = new FormData();
    const placeData = this.placeForm.value;

    // Append place data as a JSON string
    formData.append('place', JSON.stringify(placeData));

    // Append images to FormData
    this.selectedImages.forEach((image, index) => {
      formData.append(`images`, image.file, image.file.name);
    });

    if (placeData.id) {
      // Update existing place
      this.placeService.updatePlace(placeData.id, formData).subscribe(() => {
        this.resetForm();
      });
    } else {
      // Create new place
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
    this.placeService.getAllPlaces().subscribe(data => {
      this.places = data;
      // this.pic = data.images;
      console.log(data [9].images);

    });
  }

  getCategories() {
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data;
    });
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
        categoryId: place.category.id
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
        categoryId: null
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
  this.currentGallery = images?.map(img => img.path) ?? [];
  this.showGallery = true;
}


closeGallery() {
  this.showGallery = false;
}


}