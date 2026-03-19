import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Service } from '../../../../../services/service.service';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../../shared/animations';

@Component({
  selector: 'app-edit-modals-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-modals-services.component.html',
  styleUrl: './edit-modals-services.component.css',
  animations: [modalOverlayAnimation, modalContentAnimation]
})
export class EditModalsServicesComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() service?: Service;
  @Input() isSaving = false;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Service>();

  serviceForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    cost: ['', [Validators.required, Validators.min(0)]],
    price: ['', [Validators.required, Validators.min(0)]],
    duration: ['', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)]],
    active: [true],
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['service'] && this.service) {
      this.serviceForm.patchValue({
        name: this.service.name,
        cost: this.service.cost?.toString(),
        price: this.service.price?.toString(),
        duration: this.formatDuration(this.service.duration),
        active: this.service.active !== false,
      });
    }
  }

  formatDuration(duration: any): string {
    if (!duration) return '00:00:00';
    if (typeof duration === 'string') return duration;
    
    if (typeof duration === 'object') {
      const h = duration.hours !== undefined ? duration.hours : (duration.hh || 0);
      const m = duration.minutes !== undefined ? duration.minutes : (duration.mm || 0);
      const s = duration.seconds !== undefined ? duration.seconds : (duration.ss || 0);
      
      const pad = (n: any) => String(n || 0).padStart(2, '0');
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    return '00:00:00';
  }

  submit() {
    if (this.serviceForm.invalid || !this.service) return;

    const formValue = this.serviceForm.value;
    const updated: Service = {
      name: formValue.name!,
      cost: Number(formValue.cost),
      price: Number(formValue.price),
      duration: formValue.duration!,
      active: formValue.active ?? true,
    };

    this.save.emit(updated);
  }
}
