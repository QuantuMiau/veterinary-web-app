import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CloudinaryService } from '../../../../../services/cloudinary.service';
import { Product } from '../../../../../models/product.model';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../../shared/animations';

@Component({
  selector: 'app-edit-inventory-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-inventory-modal.component.html',
  styleUrl: './edit-inventory-modal.component.css',
  animations: [modalOverlayAnimation, modalContentAnimation]
})
export class EditInventoryModalComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private cloudinaryService = inject(CloudinaryService);

  @Input() item?: Product;
  @Input() isSaving = false;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Product>();

  isUploading = false;
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
    subcategory_id: [1, Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    image_url: [''],
    active: [true]
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['item'] && this.item) {
      this.itemForm.patchValue({
        product_id: this.item.product_id || '',
        name: this.item.name || '',
        description: this.item.description || '',
        cost: (this.item.cost as any) || 0,
        price: (this.item.price as any) || 0,
        category_id: this.item.category_id || 1,
        subcategory_id: this.item.subcategory_id || 1,
        stock: this.item.stock || 0,
        image_url: this.item.image_url || '',
        active: this.item.active !== undefined ? this.item.active : true
      });
    }
  }

  get filteredSubcategories() {
    const catId = Number(this.itemForm.get('category_id')?.value);
    return this.subcategories.filter(s => s.categoryId === catId);
  }

  onCategoryChange() {
    const subs = this.filteredSubcategories;
    if (subs.length > 0) {
      this.itemForm.patchValue({ subcategory_id: subs[0].id });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
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

    const formVals = this.itemForm.value;
    const payload: Product = {
      concept_id: this.item?.concept_id,
      product_id: formVals.product_id || '',
      name: formVals.name || '',
      description: formVals.description || '',
      cost: formVals.cost ?? 0,
      price: formVals.price ?? 0,
      category_id: formVals.category_id ?? 1,
      subcategory_id: formVals.subcategory_id ?? 1,
      stock: formVals.stock ?? 0,
      image_url: formVals.image_url || '',
      active: formVals.active ?? true
    };

    this.save.emit(payload);
  }
}
