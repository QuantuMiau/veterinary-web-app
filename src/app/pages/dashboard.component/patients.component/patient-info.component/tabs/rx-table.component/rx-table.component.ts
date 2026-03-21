import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClinicalRecordService } from '../../../../../../services/clinical-record.service';
import { CloudinaryService } from '../../../../../../services/cloudinary.service';
import { ClinicalRecord } from '../../../../../../models/clinical-record.model';
import { ServiceService } from '../../../../../../services/service.service';
import { Service } from '../../../../../../models/service.model';

@Component({
  selector: 'app-rx-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rx-table.component.html',
  styleUrl: './rx-table.component.css',
})
export class RxTableComponent implements OnInit, OnChanges {
  private recordService = inject(ClinicalRecordService);
  private serviceService = inject(ServiceService);
  private cloudinaryService = inject(CloudinaryService);
  private cdr = inject(ChangeDetectorRef);

  private _patientId: number = 0;
  @Input() set patientId(value: number) {
    if (value && value !== this._patientId) {
      this._patientId = value;
      this.load();
    }
  }
  get patientId(): number { return this._patientId; }

  records: ClinicalRecord[] = [];
  isLoading = true;
  showModal = false;
  isSaving = false;
  isUploading = false;
  errorMessage = '';
  allServices: Service[] = [];

  form: Partial<ClinicalRecord> = this.emptyForm();

  ngOnInit() {
    this.loadServices();
    if (this._patientId > 0) this.load();
  }

  loadServices() {
    this.serviceService.getAll().subscribe({
      next: (svs) => {
        this.allServices = svs.filter(s => s.active && s.service_type === 'RX');
        this.cdr.detectChanges();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['patientId'] && this._patientId > 0) {
      this.load();
    }
  }

  load() {
    if (!this._patientId) return;
    this.isLoading = true;
    this.cdr.detectChanges();
    this.recordService.getByPatient(this._patientId).subscribe({
      next: (all) => {
        this.records = all.filter(r => r.category === 'rx');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { 
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  emptyForm(): Partial<ClinicalRecord> {
    return {
      category: 'rx',
      studyName: '',
      date: new Date().toISOString().split('T')[0],
      results: '',
      diagnosis: '',
      notes: '',
      fileUrl: null,
    };
  }

  openModal() { this.form = this.emptyForm(); this.errorMessage = ''; this.showModal = true; }
  closeModal() { this.showModal = false; }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.isUploading = true;
    this.cloudinaryService.uploadImage(file).subscribe({
      next: (url) => { this.form.fileUrl = url; this.isUploading = false; },
      error: () => { this.isUploading = false; this.errorMessage = 'Error al subir el archivo.'; }
    });
  }

  save() {
    if (!this.form.studyName || !this.form.date) {
      this.errorMessage = 'Completa los campos requeridos.';
      return;
    }
    this.isSaving = true;
    this.errorMessage = '';
    this.recordService.create({
      patientId: this.patientId,
      category: 'rx',
      studyName: this.form.studyName!,
      date: this.form.date!,
      results: this.form.results || '',
      diagnosis: this.form.diagnosis || '',
      notes: this.form.notes || '',
      fileUrl: this.form.fileUrl || null,
    }).subscribe({
      next: () => { this.isSaving = false; this.closeModal(); this.load(); },
      error: () => { this.isSaving = false; this.errorMessage = 'Error al guardar el registro.'; }
    });
  }

  delete(id: string) {
    this.recordService.delete(id).subscribe({ next: () => this.load() });
  }

  formatDate(date: string): string {
    if (!date) return '—';
    const d = new Date(date + 'T12:00:00');
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
