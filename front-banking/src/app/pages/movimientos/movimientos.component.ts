import { Component, OnInit  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
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
export class MovimientosComponent implements OnInit {
  mostrarFormulario = false;
  nuevoMovimiento = {
    accountNumber: '',
    movementType: '',
    amount: '',
    date: ''
  };
  
  filtros = {
    identification: '',
    start: '',
    end: ''
  };

  cliente: any = null;
  clientes: any[] = [];
  movimientos: any[] = [];

  accountColors: { [accountNumber: string]: string } = {};
  availableColors: string[] = ['#CCECCE', '#C8DEEC', '#E8EFD4', '#FFF3E0', '#F3E5F5', '#E0F7FA', '#FFECB3', '#D1C4E9'];
  colorIndex = 0;

  constructor(
    private movimientosService: MovementsService, 
    private clienteService: CustomersService,
    private router: Router,
    private route: ActivatedRoute) {}
    
    ngOnInit() {
      this.route.queryParams.subscribe(params => {
        const idParam = params['identification'];
    
        if (idParam) {
          this.filtros.identification = idParam;
    
          const now = new Date();
          const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
          const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
          this.filtros.start = this.formatDate(firstDay);
          this.filtros.end = this.formatDate(lastDay);
    
          this.buscarMovimientos();
        }
      });
    
      this.loadCustomers();
    }

    openForm() {
      this.mostrarFormulario = true;
      const clienteEncontrado = this.clientes.find(c => c.identification === this.filtros.identification);
      if (clienteEncontrado && clienteEncontrado.accounts.length > 0) {
        this.nuevoMovimiento.accountNumber = clienteEncontrado.accounts[0].accountNumber;
      } else {
        this.nuevoMovimiento.accountNumber = '';
      }
      const hoy = new Date();
      hoy.setHours(hoy.getHours() - 5);
      this.nuevoMovimiento.date = hoy.toISOString().split('T')[0];
    }

    closeForm() {
      this.mostrarFormulario = false;
      this.nuevoMovimiento = {
        accountNumber: '',
        movementType: '',
        amount: '',
        date: ''
      };
    }

    saveMovement() {
      const amount = Number(this.nuevoMovimiento.amount);
      if (amount <= 0) {
        alert('El monto debe ser mayor a cero');
        return;
      }

      const movimiento = {
        account: { accountNumber: this.nuevoMovimiento.accountNumber },
        movementType: this.nuevoMovimiento.movementType,
        amount: this.nuevoMovimiento.amount,
        date: this.nuevoMovimiento.date
      };
    
      this.movimientosService.createMovement(movimiento).subscribe({
        next: (response:any) => {
          alert(response?.description || 'Movimiento guardado exitosamente');
          this.closeForm();
          this.buscarMovimientos(); 
        },
        error: (er:any) => {
          alert(er?.error?.description ||'Error al guardar el movimiento');
        }
      });
    }
    
    formatDate(date: Date): string {
      return date.toISOString().split('T')[0];
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
                balance: mov.balance,
                id: mov.id
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
  
    doc.setFontSize(16);
    doc.text(`Movimientos de ${this.cliente?.name} (${this.cliente?.identification})`, 14, 15);
  
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

  getColorForAccount(accountNumber: string | number): string {
    const key = String(accountNumber); 
    if (!this.accountColors[key]) {
      this.accountColors[key] = this.availableColors[this.colorIndex % this.availableColors.length];
      this.colorIndex++;
    }
    return this.accountColors[key];
  }

  eliminarMovimiento(id:any){
    if (confirm('El movimiento se reversará (eliminar)')) {
      this.movimientosService.deleteMovement(id).subscribe({
        next: (response:any) => {
          alert(response?.description || 'Movimiento reversado exitosamente (eliminado)');
          this.buscarMovimientos();
        },
        error: (error: any) => {
          alert(error?.error?.description || 'Error al eliminar el movimiento');
        }
      });
    }
  }

}


