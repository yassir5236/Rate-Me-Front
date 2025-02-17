import { Component, OnInit } from '@angular/core';
import { Place, PlaceService } from '../services/place.service';
import { Category, CategoryService } from '../services/category.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-place-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Use ReactiveFormsModule
  templateUrl: './place-management.component.html',
  styleUrls: ['./place-management.component.css']
})
export class PlaceManagementComponent implements OnInit {
  places: Place[] = [];
  categories: Category[] = [];
  placeForm!: FormGroup;
  showForm = false;

  constructor(
    private placeService: PlaceService,
    private categoryService: CategoryService,
    private fb: FormBuilder // Inject FormBuilder
  ) {}

  ngOnInit(): void {
    this.getPlaces();
    this.getCategories();
    this.initForm(); // Initialize the form
  }

  // Initialize the form with all fields
  initForm() {
    this.placeForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: [''],
      photo: [''],
      address: [''],
      latitude: [null],
      longitude: [null],
      averageRating: [null],
      categoryId: [null, Validators.required] // Flat field for category ID
    });
  }

  getPlaces() {
    this.placeService.getAllPlaces().subscribe(data => {
      this.places = data;
    });
  }

  getCategories() {
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data;
    });
  }

  // Open the form for adding/editing
  openForm(place: Place | null = null) {
    if (place) {
      // Populate the form with the selected place's data
      this.placeForm.patchValue({
        id: place.id,
        name: place.name,
        description: place.description,
        photo: place.photo,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        averageRating: place.averageRating,
        categoryId: place.category.id // Map nested category to flat field
      });
    } else {
      // Reset the form for a new place
      this.placeForm.reset({
        id: null,
        name: '',
        description: '',
        photo: '',
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

  // Save the place
  savePlace() {
    if (this.placeForm.invalid) {
      return; // Don't proceed if the form is invalid
    }

    const placeRequest = this.placeForm.value; // Get the form values

    if (placeRequest.id) {
      // Update existing place
      this.placeService.updatePlace(placeRequest.id, placeRequest).subscribe(() => {
        this.getPlaces();
        this.closeForm();
      });
    } else {
      // Create new place
      this.placeService.createPlace(placeRequest).subscribe(() => {
        this.getPlaces();
        this.closeForm();
      });
    }
  }

  deletePlace(id: number) {
    this.placeService.deletePlace(id).subscribe(() => {
      this.getPlaces();
    });
  }
}