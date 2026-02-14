import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-inventory-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-inventory-modal.component.html',
  styleUrl: './add-inventory-modal.component.css',
})
export class AddInventoryModalComponent {
  private fb = inject(FormBuilder);

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  itemForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    category: ['', Validators.required],
    subcategory: ['', Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  submit() {
    if (this.itemForm.invalid) return;

    const payload = this.itemForm.value;
    this.save.emit(payload);
    this.close.emit();
  }
}
