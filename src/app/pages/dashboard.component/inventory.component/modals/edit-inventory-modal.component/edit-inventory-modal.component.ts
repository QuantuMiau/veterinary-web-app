import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-inventory-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-inventory-modal.component.html',
  styleUrl: './edit-inventory-modal.component.css',
})
export class EditInventoryModalComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() item?: any;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  itemForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    category: ['', Validators.required],
    subcategory: ['', Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['item'] && this.item) {
      this.itemForm.patchValue({
        name: this.item.name,
        category: this.item.category,
        subcategory: this.item.subcategory,
        stock: this.item.stock,
        price: this.item.price,
      });
    }
  }

  submit() {
    if (this.itemForm.invalid) return;

    const payload = { ...(this.itemForm.value as any) };
    if (this.item && this.item.id) payload.id = this.item.id;

    this.save.emit(payload);
    this.close.emit();
  }
}
