import { Component, Input, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClinicalRecordService } from '../../../../../../services/clinical-record.service';
import { CloudinaryService } from '../../../../../../services/cloudinary.service';
import { ClinicalRecord } from '../../../../../../models/clinical-record.model';
import { ServiceService } from '../../../../../../services/service.service';
import { Service } from '../../../../../../models/service.model';

@Component({
  selector: 'app-visits-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visits-table.component.html',
  styleUrl: './visits-table.component.css',
})
export class VisitsTableComponent implements OnInit, OnChanges {
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

  categoryOptions: { v: 'visita' | 'vacuna'; l: string }[] = [
    { v: 'visita', l: 'Visita' },
    { v: 'vacuna', l: 'Vacuna' },
  ];

  ngOnInit() {
    this.loadServices();
    if (this._patientId > 0) this.load();
  }

  loadServices() {
    this.serviceService.getAll().subscribe({
      next: (svs) => {
        this.allServices = svs.filter(s => s.active);
        this.cdr.detectChanges();
      }
    });
  }

  getFilteredServices(): Service[] {
    const targetType = this.form.category === 'vacuna' ? 'vacuna' : 'consulta';
    return this.allServices.filter(s => s.service_type === targetType);
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
        this.records = all.filter(r => r.category === 'visita' || r.category === 'vacuna');
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
      category: 'visita',
      studyName: '',
      date: new Date().toISOString().split('T')[0],
      results: '',
      diagnosis: '',
      notes: '',
      nextApplication: '',
      brand: '',
      batch: '',
      fileUrl: null,
    };
  }

  openModal() {
    this.form = this.emptyForm();
    this.errorMessage = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

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
    if (!this.form.studyName || !this.form.date || !this.form.category) {
      this.errorMessage = 'Completa los campos requeridos.';
      return;
    }
    this.isSaving = true;
    this.errorMessage = '';
    this.recordService.create({
      patientId: this.patientId,
      category: this.form.category as any,
      studyName: this.form.studyName!,
      date: this.form.date!,
      results: this.form.results || '',
      diagnosis: this.form.diagnosis || '',
      notes: this.form.notes || '',
      nextApplication: this.form.nextApplication || '',
      brand: this.form.brand || '',
      batch: this.form.batch || '',
      fileUrl: this.form.fileUrl || null,
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        this.load();
      },
      error: () => { this.isSaving = false; this.errorMessage = 'Error al guardar el registro.'; }
    });
  }

  delete(id: string) {
    this.recordService.delete(id).subscribe({ next: () => this.load() });
  }

  getCategoryBadge(category: string) {
    switch (category) {
      case 'vacuna': return { bg: 'bg-purple-50 text-purple-700 border-purple-100', label: 'Vacuna' };
      default: return { bg: 'bg-blue-50 text-blue-700 border-blue-100', label: 'Visita' };
    }
  }

  formatDate(date: string): string {
    if (!date) return '—';
    const d = new Date(date + 'T12:00:00');
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
