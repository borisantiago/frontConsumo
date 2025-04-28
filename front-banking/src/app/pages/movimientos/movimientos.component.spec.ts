import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MovimientosComponent } from './movimientos.component';
import { CustomersService } from '../../service/customers.service';
import { MovementsService } from '../../service/movements.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

const setFontSize = jest.fn();
const text = jest.fn();
const save = jest.fn();

jest.mock('jspdf', () => {
  return {
    __esModule: true, // 👈 Esto arregla tu error actual
    default: jest.fn().mockImplementation(() => ({
      setFontSize,
      text,
      save
    }))
  };
});

jest.mock('jspdf-autotable', () => jest.fn());

describe('MovimientosComponent', () => {
  let component: MovimientosComponent;
  let fixture: ComponentFixture<MovimientosComponent>;
  let customerServiceMock: any;
  let movementsServiceMock: any;

  beforeEach(async () => {
    customerServiceMock = {
      getCustomers: jest.fn().mockReturnValue(of([{ name: 'Cliente Test', identification: '123' }]))
    };

    movementsServiceMock = {
      visualizarMovements: jest.fn().mockReturnValue(of({
        name: 'Cliente Test',
        identification: '123',
        accounts: [
          {
            accountNumber: 'ACC123',
            accountType: 'AHORROS',
            movements: [
              {
                movementType: 'CREDITO',
                amount: 100,
                date: '2025-01-01',
                balance: 1000
              }
            ]
          }
        ]
      }))
    };

    await TestBed.configureTestingModule({
      imports: [MovimientosComponent, RouterTestingModule],
      providers: []
    })
    .overrideComponent(MovimientosComponent, {
      set: {
        providers: [
          { provide: CustomersService, useValue: customerServiceMock },
          { provide: MovementsService, useValue: movementsServiceMock }
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load customers on init', fakeAsync(() => {
    component.loadCustomers();
    tick();
    fixture.detectChanges();
    expect(customerServiceMock.getCustomers).toHaveBeenCalled();
    expect(component.clientes.length).toBeGreaterThan(0);
  }));

  it('should fetch movements and populate cliente and movimientos', fakeAsync(() => {
    component.filtros.identification = '123';
    component.filtros.start = '2025-01-01';
    component.filtros.end = '2025-12-31';

    component.buscarMovimientos();

    tick();
    fixture.detectChanges();

    expect(movementsServiceMock.visualizarMovements).toHaveBeenCalledWith('123', '2025-01-01', '2025-12-31');
    expect(component.cliente).toEqual({ name: 'Cliente Test', identification: '123' });
    expect(component.movimientos.length).toBeGreaterThan(0);
  }));

  it('should generate a PDF', () => {
    component.cliente = { name: 'Cliente Test', identification: '123' };
    component.movimientos = [
      {
        accountNumber: 'ACC123',
        accountType: 'AHORROS',
        movementType: 'CREDITO',
        date: '2025-01-01',
        amount: 100,
        balance: 1000
      }
    ];

    component.generarPDF();

    expect(setFontSize).toHaveBeenCalledWith(16);
    expect(text).toHaveBeenCalledWith('Movimientos de Cliente Test (123)', 14, 15);
    expect(save).toHaveBeenCalledWith('Movimientos-123.pdf');
  });

});
