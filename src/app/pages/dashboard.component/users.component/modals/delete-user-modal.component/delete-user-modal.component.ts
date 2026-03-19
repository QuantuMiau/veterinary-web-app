import { Component, EventEmitter, Input, Output } from '@angular/core';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../../shared/animations';

@Component({
  selector: 'app-delete-user-modal',
  imports: [],
  templateUrl: './delete-user-modal.component.html',
  styleUrl: './delete-user-modal.component.css',
  animations: [modalContentAnimation, modalOverlayAnimation]
})
export class DeleteUserModalComponent {
  @Input() userId?: number;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  @Input() isLoading = false;
  
  @Output() close = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<number>();

  constructor() {}

  confirm() {
    this.confirmDelete.emit(this.userId!);
  }

  cancel() {
    this.close.emit();
  }
}
