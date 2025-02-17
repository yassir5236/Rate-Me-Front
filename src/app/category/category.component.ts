import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from '../services/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-category',
  imports: [FormsModule,CommonModule],
templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})


export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  showForm = false; // Pour afficher/masquer le formulaire
  currentCategory: Partial<Category> = {}; // Catégorie en cours d'édition

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data;
    });
  }

  openForm(category?: Category): void {
    this.currentCategory = category ? { ...category } : {}; // Initialiser la catégorie
    this.showForm = true; // Afficher le formulaire
  }

  closeForm(): void {
    this.showForm = false; // Masquer le formulaire
    this.currentCategory = {}; // Réinitialiser la catégorie
  }

  saveCategory(): void {
    if (this.currentCategory.id) {
      // Mettre à jour la catégorie existante
      this.categoryService.updateCategory(this.currentCategory.id, this.currentCategory).subscribe(() => {
        this.loadCategories();
        this.closeForm();
      });
    } else {
      // Créer une nouvelle catégorie
      this.categoryService.createCategory(this.currentCategory).subscribe(() => {
        this.loadCategories();
        this.closeForm();
      });
    }
  }

  deleteCategory(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      this.categoryService.deleteCategory(id).subscribe(() => this.loadCategories());
    }
  }
}