import { Component } from '@angular/core';
import { CustomersService } from '../../service/customers.service';
import { AccountsService } from "../../service/accounts.service";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MovementsService } from '../../service/movements.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [CustomersService, AccountsService]
})
export class CuentasComponent {
  clientes: any[] = [];
  mostrarFormulario = false;
  errorMessage: string = '';
  nuevaCuenta = {
    identification: '',
    accountType: '',
    balance: '',
    status: ''
  };

  constructor(private clienteService: CustomersService, private cuentaService: AccountsService, 
    private movimientosService: MovementsService, private router: Router){
      
    this.loadCustomers();
  }

  verMovimientos(identification: string) {
    this.router.navigate(['/movimientos'], { queryParams: { identification } });
  }

  loadCustomers() {
    this.clienteService.getCustomers().subscribe(data => {
      this.clientes = data;      
    });
  }

  openForm() {
    this.mostrarFormulario = true;
  }

  closeForm() {
    this.mostrarFormulario = false;
    this.nuevaCuenta = {
      identification: '',
      accountType: '',
      balance: '',
      status: ''
    };
  }

  saveAccount() {
    const nuevaCuenta = {
      accountType: this.nuevaCuenta.accountType,
      balance: this.nuevaCuenta.balance,
      accountStatus: true,
      customer: {
        identification: this.nuevaCuenta.identification
      } 
    };

    this.cuentaService.createAccount(nuevaCuenta).subscribe(() => {
      this.clientes.push(nuevaCuenta);
      this.closeForm();
      this.loadCustomers();
    });
  }

  findCustomer(valor: string){
    this.errorMessage = '';
    this.clientes = [];
    const cedula = {
      identification: valor
    };

    this.clienteService.findCustomer(cedula).subscribe({
      next: (customer) => {
        this.clientes = [customer];
      },
    error: (err) => {
      console.error('Error:', err);
      this.errorMessage = err?.error?.description + " '" + cedula.identification + "'" || 'Error desconocido';
      this.loadCustomers();
    }
    });
  }

  eliminarCuenta(identificacion: any) {
    if (confirm('¿Esta seguro de eliminar la cuenta?, al acptarlo tambien se eliminará sus movimientos')) {
      this.cuentaService.deleteAccount(identificacion).subscribe({
        next: () => {
          this.clientes = this.clientes.filter(c => c.identification !== identificacion);
          this.loadCustomers();
        },
        error: () => {
          alert('Error al eliminar el cliente');
        }
      });
    }
  }


}