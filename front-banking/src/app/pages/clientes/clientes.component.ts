import { Component, OnInit  } from '@angular/core';
import { CustomersService } from '../../service/customers.service';
import { AccountsService } from "../../service/accounts.service";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { error } from 'console';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CustomersService, AccountsService]
})
export class ClientesComponent {
  clientes: any[] = [];
  mostrarFormulario = false;
  errorMessage: string = '';
  nuevoCliente = {
    name: '',
    gender: '',
    age: '',
    identification: '',
    address: '',
    phone: '',
    password: '',
    status: '',
    accountType: '',
    balance: ''
  };

  constructor(private clienteService: CustomersService, private cuentaService: AccountsService) {
    this.loadCustomers();
  }

  loadCustomers() {
    this.clienteService.getCustomers().subscribe(data => {
      this.clientes = data; 
      console.log(this.clientes);  
    });
  }

  openForm() {
    this.mostrarFormulario = true;
  }

  closeForm() {
    this.mostrarFormulario = false;
    this.nuevoCliente = {
      name: '',
      gender: '',
      age: '',
      identification: '',
      address: '',
      phone: '',
      password: '',
      status: '',
      accountType: '',
      balance: ''
    };
  }

  saveCustomer() {
    const nuevo = {
      name: this.nuevoCliente.name,
      identification: this.nuevoCliente.identification,
      gender: this.nuevoCliente.gender,
      age: this.nuevoCliente.age,
      address: this.nuevoCliente.address,
      phone: this.nuevoCliente.phone,
      password: this.nuevoCliente.password,
      status: true
    };

    this.clienteService.createCustomer(nuevo).subscribe(() => {
      this.clientes.push(nuevo);
      this.saveAccount();
      this.closeForm();
      this.loadCustomers();
    });
  }

  saveAccount() {
    const nuevaCuenta = {
      accountType: this.nuevoCliente.accountType,
      balance: this.nuevoCliente.balance,
      accountStatus: true,
      customer: {identification: this.nuevoCliente.identification}
    };

    this.cuentaService.createAccount(nuevaCuenta).subscribe(() => {
      this.clientes.push(nuevaCuenta);
      this.closeForm();
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

  eliminarCliente(identificacion: string) {
    if (confirm('¿El usuario será cambiado el estado a cancelado y se archivara, sus cuentas y movimientos seran eliminados?')) {
      this.clienteService.deleteCustomer(identificacion).subscribe({
        next: () => {
          this.clientes = this.clientes.filter(c => c.identification !== identificacion);
        },
        error: () => {
          alert('Error al eliminar el cliente');
        }
      });
    }
  }
  
}