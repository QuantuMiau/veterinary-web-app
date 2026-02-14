import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-user-modal',
  imports: [],
  templateUrl: './delete-user-modal.component.html',
  styleUrl: './delete-user-modal.component.css',
})
export class DeleteUserModalComponent {
  @Input() userId?: number;
  @Output() close = new EventEmitter<void>();

  @Output() confirmDelete = new EventEmitter<number>();

  constructor() {}

  confirm() {
    this.confirmDelete.emit(this.userId!);
    this.close.emit();
  }

  cancel() {
    this.close.emit();
  }
}
