import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SaleService } from '../../../../services/sale.service';
import { SaleDetailItem } from '../../../../models/sale.model';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-sale-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [CurrencyPipe, DatePipe],
  templateUrl: './sale-details.component.html',
  styleUrl: './sale-details.component.css',
})
export class SaleDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private saleService = inject(SaleService);
  private cdr = inject(ChangeDetectorRef);
  private currencyPipe = inject(CurrencyPipe);
  private datePipe = inject(DatePipe);

  saleId: number = 0;
  details: SaleDetailItem[] = [];
  isLoading = true;
  errorMessage = '';

  headerInfo: {
    employee_name: string;
    employee_id: number;
    date: string;
    amount: string | number;
    payment_method: string;
  } | null = null;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.saleId = Number(params['id']);
      if (this.saleId) {
        this.loadDetails();
      }
    });
  }

  loadDetails() {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.saleService.getById(this.saleId).subscribe({
      next: (res: SaleDetailItem[]) => {
        this.details = res;
        if (res.length > 0) {
          const first = res[0];
          this.headerInfo = {
            employee_name: first.employee_name,
            employee_id: first.employee_id,
            date: first.date,
            amount: first.amount,
            payment_method: first.payment_method
          };
        }

        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 800);
      },
      error: (err: any) => {
        console.error('Error loading sale details:', err);
        this.errorMessage = 'No se pudo cargar el detalle de la venta.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getPaymentMethodColor(method: string): string {
    const m = method?.toLowerCase() || '';
    if (m === 'efectivo') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (m === 'stripe') return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    if (m === 'transferencia') return 'bg-sky-100 text-sky-700 border-sky-200';
    if (m === 'credito') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  }

  goBack() {
    this.router.navigate(['/admin/dashboard/ventas']);
  }

  printTicket() {
    if (!this.headerInfo || this.details.length === 0) return;

    const doc = new jsPDF({
      unit: 'mm',
      format: [80, 150 + (this.details.length * 10)]
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let currY = 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Veterinaria San Francisco de Asís', pageWidth / 2, currY, { align: 'center' });

    currY += 6;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Veterinaria & Estética', pageWidth / 2, currY, { align: 'center' });
    currY += 8;

    doc.setFontSize(7);
    doc.text(`Ticket: #${this.saleId}`, 10, currY);
    currY += 4;
    doc.text(`Fecha: ${this.datePipe.transform(this.headerInfo.date, 'dd/MM/yyyy HH:mm:ss')}`, 10, currY);
    currY += 4;
    doc.text(`Atendió: ${this.headerInfo.employee_name}`, 10, currY);
    currY += 6;

    doc.setLineWidth(0.1);
    doc.line(10, currY, pageWidth - 10, currY);
    currY += 2;

    autoTable(doc, {
      startY: currY,
      margin: { left: 5, right: 5 },
      head: [['Cant', 'Concepto', 'Total']],
      body: this.details.map(item => [
        item.quantity,
        item.concept_name,
        this.currencyPipe.transform(item.subtotal) || ''
      ]),
      theme: 'plain',
      styles: { fontSize: 7, cellPadding: 1 },
      headStyles: { fontStyle: 'bold', fillColor: [240, 240, 240], textColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 20, halign: 'right' }
      },
      didDrawPage: (data) => {
        currY = data.cursor?.y || currY;
      }
    });

    currY += 4;
    doc.line(10, currY, pageWidth - 10, currY);
    currY += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', pageWidth - 30, currY, { align: 'right' });
    doc.text(this.currencyPipe.transform(this.headerInfo.amount) || '', pageWidth - 10, currY, { align: 'right' });

    currY += 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Método: ${this.headerInfo.payment_method}`, 10, currY);

    currY += 10;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.text('¡Gracias por confiar en Veterinaria San Francisco de Asís!', pageWidth / 2, currY, { align: 'center' });


    doc.save(`Ticket_Venta_${this.saleId}.pdf`);
  }
}
