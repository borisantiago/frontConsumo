import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CuentasComponent } from './cuentas.component';
import { CustomersService } from '../../service/customers.service';
import { AccountsService } from '../../service/accounts.service';
import { MovementsService } from '../../service/movements.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('CuentasComponent', () => {
  let component: CuentasComponent;
  let fixture: ComponentFixture<CuentasComponent>;
  let customerServiceMock: any;
  let accountServiceMock: any;
  let movimientosServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    customerServiceMock = {
      createCustomer: jest.fn(),
      findCustomer: jest.fn().mockReturnValue(of({})),
      getCustomers: jest.fn().mockReturnValue(of([]))
    };

    accountServiceMock = {
      createAccount: jest.fn().mockReturnValue(of({})),
      deleteAccount: jest.fn().mockReturnValue(of({}))
    };

    movimientosServiceMock = {
      visualizarMovements: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CuentasComponent, RouterTestingModule],
      providers: []
    })
    .overrideComponent(CuentasComponent, {
      set: {
        providers: [
          { provide: CustomersService, useValue: customerServiceMock },
          { provide: AccountsService, useValue: accountServiceMock },
          { provide: MovementsService, useValue: movimientosServiceMock }
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentasComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the form', () => {
    component.openForm();
    expect(component.mostrarFormulario).toBe(true);
  });

  it('should close the form and reset nuevaCuenta', () => {
    component.mostrarFormulario = true;
    component.nuevaCuenta.identification = '12345';
    component.closeForm();
    expect(component.mostrarFormulario).toBe(false);
    expect(component.nuevaCuenta.identification).toBe('');
  });

  it('should call createAccount and reload customers when saving', fakeAsync(() => {
    const closeFormSpy = jest.spyOn(component, 'closeForm').mockImplementation(() => {});
    const loadCustomersSpy = jest.spyOn(component, 'loadCustomers').mockImplementation(() => {});

    component.nuevaCuenta.accountType = 'Savings';
    component.nuevaCuenta.balance = '500';
    component.nuevaCuenta.identification = '1234567890';

    component.saveAccount();

    tick();
    fixture.detectChanges();

    expect(accountServiceMock.createAccount).toHaveBeenCalled();
    expect(closeFormSpy).toHaveBeenCalled();
    expect(loadCustomersSpy).toHaveBeenCalled();
  }));

  it('should find a customer', fakeAsync(() => {
    component.findCustomer('1234567890');

    tick();
    fixture.detectChanges();

    expect(customerServiceMock.findCustomer).toHaveBeenCalled();
    expect(component.clientes.length).toBe(1);
  }));

  it('should handle error when finding a customer', fakeAsync(() => {
    const errorMock = { error: { description: 'Cliente no encontrado' } };
    customerServiceMock.findCustomer.mockReturnValueOnce(throwError(() => errorMock));
    jest.spyOn(component, 'loadCustomers').mockImplementation(() => {});

    component.findCustomer('1234567890');

    tick();
    fixture.detectChanges();

    expect(component.errorMessage).toContain("Cliente no encontrado '1234567890'");
    expect(component.loadCustomers).toHaveBeenCalled();
  }));

  it('should delete an account if confirmed', fakeAsync(() => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    jest.spyOn(component, 'loadCustomers').mockImplementation(() => {});

    component.clientes = [{ identification: '123456' }];
    component.eliminarCuenta('123456');

    tick();
    fixture.detectChanges();

    expect(accountServiceMock.deleteAccount).toHaveBeenCalledWith('123456');
    expect(component.loadCustomers).toHaveBeenCalled();
  }));

  it('should navigate to movimientos when verMovimientos is called', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.verMovimientos('12345');

    expect(navigateSpy).toHaveBeenCalledWith(['/movimientos'], { queryParams: { identification: '12345' } });
  });

});
