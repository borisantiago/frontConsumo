import { Component } from '@angular/core';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {
  clientes = [
    { nombre: 'Juan Pérez' },
    { nombre: 'Ana Gómez' },
    { nombre: 'Luis Martínez' },
    { nombre: 'María Rodríguez' }
  ];
}