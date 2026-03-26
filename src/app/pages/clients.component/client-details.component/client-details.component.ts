import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { PatientService } from '../../../services/patient-service';
import { SaleService } from '../../../services/sale.service';
import { CreditService } from '../../../services/credit.service';
import { Client } from '../../../models/client.model';
import { PatientDetailed } from '../../../models/patient.model';
import { Credit, CreditPayment } from '../../../models/credit.model';
import { AddPaymentModalComponent } from '../modals/add-payment-modal.component/add-payment-modal.component';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AddPaymentModalComponent],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css',
})
export class ClientDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clientService = inject(ClientService);
  private patientService = inject(PatientService);
  private saleService = inject(SaleService);
  private creditService = inject(CreditService);
  private cdr = inject(ChangeDetectorRef);

  clientId: number = 0;
  client: Client | null = null;
  patients: PatientDetailed[] = [];
  credits: Credit[] = [];
  
  activeTab: 'creditos' | 'pacientes' = 'pacientes';
  isLoading = true;
  errorMessage = '';

  // Credit Payment Modal State
  showPaymentModal = false;
  selectedCredit: Credit | null = null;
  isSavingPayment = false;
  paymentErrorMessage = '';

  // Payment History State
  showHistoryModal = false;
  paymentHistory: CreditPayment[] = [];
  isLoadingHistory = false;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.clientId = Number(params['id']);
      if (this.clientId) {
        this.loadAllData();
      }
    });
  }

  loadAllData() {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.clientService.getById(this.clientId).subscribe({
      next: (res) => {
        this.client = res;
        this.loadPatients();
        this.loadCredits();
      },
      error: (err) => {
        console.error('Error loading client:', err);
        this.errorMessage = 'No se pudo cargar la información del cliente.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadPatients() {
    this.patientService.getByClient(this.clientId).subscribe({
      next: (res) => {
        this.patients = res;
        this.checkLoadingState();
      },
      error: (err) => console.error('Error loading patients:', err)
    });
  }

  loadCredits() {
    this.creditService.getByClient(this.clientId).subscribe({
      next: (res) => {
        this.credits = res;
        this.checkLoadingState();
      },
      error: (err) => {
        console.error('Error loading credits:', err);
        this.checkLoadingState();
      }
    });
  }

  private checkLoadingState() {
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 800);
  }

  // Payment Logic
  openAddPayment(credit: Credit) {
    this.selectedCredit = credit;
    this.showPaymentModal = true;
    this.paymentErrorMessage = '';
    this.cdr.detectChanges();
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.selectedCredit = null;
    this.paymentErrorMessage = '';
    this.cdr.detectChanges();
  }

  registerPayment(amount: number) {
    if (!this.selectedCredit) return;
    
    this.isSavingPayment = true;
    this.paymentErrorMessage = '';
    this.cdr.detectChanges();

    this.creditService.addPayment(this.selectedCredit.credit_id, { amount }).subscribe({
      next: () => {
        this.isSavingPayment = false;
        this.closePaymentModal();
        this.loadCredits(); // Refresh balances
      },
      error: (err) => {
        console.error('Error adding payment:', err);
        this.isSavingPayment = false;
        this.paymentErrorMessage = err.error?.message || 'Error al registrar el abono.';
        this.cdr.detectChanges();
      }
    });
  }

  // History Logic
  viewHistory(credit: Credit) {
    this.selectedCredit = credit;
    this.showHistoryModal = true;
    this.isLoadingHistory = true;
    this.paymentHistory = [];
    this.cdr.detectChanges();

    this.creditService.getDetail(credit.credit_id).subscribe({
      next: (res) => {
        this.paymentHistory = res;
        this.isLoadingHistory = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading history:', err);
        this.isLoadingHistory = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeHistoryModal() {
    this.showHistoryModal = false;
    this.selectedCredit = null;
    this.paymentHistory = [];
    this.cdr.detectChanges();
  }

  get totalPendingAmount(): number {
    return this.credits.reduce((acc, cr) => acc + (+cr.remaining || 0), 0);
  }

  goBack() {
    this.router.navigate(['/admin/dashboard/clients']);
  }
}
