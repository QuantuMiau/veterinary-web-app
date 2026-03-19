import { Component, EventEmitter, inject, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CloudinaryService } from '../../../../../services/cloudinary.service';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../../shared/animations';

@Component({
  selector: 'app-add-inventory-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-inventory-modal.component.html',
  styleUrl: './add-inventory-modal.component.css',
  animations: [modalOverlayAnimation, modalContentAnimation]
})
export class AddInventoryModalComponent {
  private fb = inject(FormBuilder);
  private cloudinaryService = inject(CloudinaryService);

  @Input() isSaving = false;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  isUploading = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  categories = [
    { id: 1, name: 'Alimento' },
    { id: 2, name: 'Medicina' },
    { id: 3, name: 'Juguete' },
    { id: 4, name: 'Accesorios' }
  ];

  subcategories = [
    { id: 1, categoryId: 1, name: 'Húmedo' },
    { id: 2, categoryId: 1, name: 'Seco' },
    { id: 3, categoryId: 2, name: 'Desparasitante' },
    { id: 4, categoryId: 2, name: 'Vitaminas' },
    { id: 5, categoryId: 3, name: 'Pelotas' },
    { id: 6, categoryId: 3, name: 'Interactivos' },
    { id: 7, categoryId: 4, name: 'Collares' },
    { id: 8, categoryId: 4, name: 'Ropa' }
  ];

  itemForm = this.fb.group({
    product_id: ['', [Validators.required, Validators.minLength(3)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    cost: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
    category_id: [1, Validators.required],
    subcategoryId: [1, Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    image_url: [''],
  });

  get filteredSubcategories() {
    const catId = Number(this.itemForm.get('category_id')?.value);
    return this.subcategories.filter(s => s.categoryId === catId);
  }

  onCategoryChange() {
    const subs = this.filteredSubcategories;
    if (subs.length > 0) {
      this.itemForm.patchValue({ subcategoryId: subs[0].id });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Preview
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);

      this.isUploading = true;
      this.cloudinaryService.uploadImage(file).subscribe({
        next: (url: string) => {
          this.itemForm.patchValue({ image_url: url });
          this.isUploading = false;
        },
        error: (err: any) => {
          this.errorMessage = 'Error al subir la imagen';
          this.isUploading = false;
        }
      });
    }
  }

  submit() {
    if (this.itemForm.invalid || this.isSaving || this.isUploading) {
      Object.values(this.itemForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    // Map to the requested payload if needed
    const formVals = this.itemForm.value;
    const payload = {
      productId: formVals.product_id,
      name: formVals.name,
      description: formVals.description,
      cost: formVals.cost,
      price: formVals.price,
      categoryId: formVals.category_id,
      subcategoryId: formVals.subcategoryId,
      stock: formVals.stock,
      imageUrl: formVals.image_url,
      active: true
    };

    this.save.emit(payload);
  }
}
