import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovementsService } from '../../service/movements.service';
import { CustomersService } from '../../service/customers.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [MovementsService, CustomersService, ]
})
export class MovimientosComponent {
  filtros = {
    identification: '',
    start: '',
    end: ''
  };

  cliente: any = null;
  clientes: any[] = [];
  movimientos: any[] = [];


  constructor(private movimientosService: MovementsService, private clienteService: CustomersService) {
    this.loadCustomers();
  }

  buscarMovimientos() {
    const { identification, start, end } = this.filtros;

    this.movimientosService.visualizarMovements(identification, start, end)
    .subscribe(data => {

      this.cliente = {
        name: data.name,
        identification: data.identification
      };

      this.movimientos = [];

      if (Array.isArray(data.accounts)) {
        data.accounts.forEach((account: { movements: any[]; accountNumber: any; accountType: any; }) => {
          if (Array.isArray(account.movements)) {
            account.movements.forEach(mov => {
              this.movimientos.push({
                accountNumber: account.accountNumber,
                accountType: account.accountType,
                movementType: mov.movementType,
                amount: mov.amount,
                date: mov.date,
                balance: mov.balance
              });
            });
          }
        });
      }
    });
  }

  loadCustomers() {
    this.clienteService.getCustomers().subscribe(data => {
      this.clientes = data; 
    });
  }

  generarPDF() {
    const doc = new jsPDF();
  
    // Título
    doc.setFontSize(16);
    doc.text(`Movimientos de ${this.cliente?.name} (${this.cliente?.identification})`, 14, 15);
  
    // Tabla
    autoTable(doc, {
      startY: 25,
      head: [['N° Cuenta', 'Tipo de Cuenta', 'Tipo Movimiento', 'Fecha', 'Monto', 'Balance']],
      body: this.movimientos.map(mov => [
        mov.accountNumber,
        mov.accountType,
        mov.movementType,
        mov.date,
        (mov.movementType === 'DEBITO' ? '-' : '') + `$${mov.amount.toFixed(2)}`,
        `$${mov.balance.toFixed(2)}`
      ]),
      styles: {
        halign: 'center',
        fontSize: 10
      },
      headStyles: {
        fillColor: [100, 100, 100],
        textColor: 255
      }
    });
  
    doc.save(`Movimientos-${this.cliente?.identification}.pdf`);
  }


}


