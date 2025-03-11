import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from '../services/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category',
  imports: [FormsModule, CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  showForm = false;
  currentCategory: Partial<Category> = {};

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  openForm(category?: Category): void {
    this.currentCategory = category ? { ...category } : {};
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.currentCategory = {};
  }

  saveCategory(): void {
    if (this.currentCategory.id) {
      this.categoryService
        .updateCategory(this.currentCategory.id, this.currentCategory)
        .subscribe(() => {
          this.loadCategories();
          this.closeForm();
          this.toastr.success('Category updated with success!');
        });
    } else {
      this.categoryService
        .createCategory(this.currentCategory)
        .subscribe(() => {
          this.loadCategories();
          this.closeForm();
          this.toastr.success('Category created with success!');
        });
    }
  }

  deleteCategory(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
        this.toastr.success('Category deleted with success!');
      });
    }
  }
}
