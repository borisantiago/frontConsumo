import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ClientesComponent } from './clientes.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomersService } from '../../service/customers.service';
import { AccountsService } from '../../service/accounts.service';
import { of, throwError } from 'rxjs';

describe('ClientesComponent', () => {
  let component: ClientesComponent;
  let fixture: ComponentFixture<ClientesComponent>;
  let customerServiceMock: any;
  let accountServiceMock: any;

  beforeEach(async () => {
    customerServiceMock = {
      createCustomer: jest.fn().mockReturnValue(of({})),
      findCustomer: jest.fn().mockReturnValue(of({})),
      deleteCustomer: jest.fn().mockReturnValue(of({})),
      getCustomers: jest.fn().mockReturnValue(of([]))
    };
  
    accountServiceMock = {
      createAccount: jest.fn().mockReturnValue(of({}))
    };
  
    await TestBed.configureTestingModule({
      imports: [ClientesComponent, HttpClientTestingModule],
      providers: []
    })
    .overrideComponent(ClientesComponent, {
      set: {
        providers: [
          { provide: CustomersService, useValue: customerServiceMock },
          { provide: AccountsService, useValue: accountServiceMock }
        ]
      }
    })
    .compileComponents();
  
    fixture = TestBed.createComponent(ClientesComponent);
    component = fixture.componentInstance;
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

  it('should close the form and reset nuevoCliente', () => {
    component.mostrarFormulario = true;
    component.nuevoCliente.name = 'Test';
    component.closeForm();
    expect(component.mostrarFormulario).toBe(false);
    expect(component.nuevoCliente.name).toBe('');
  });

  it('should call createCustomer and reload customers when saving', fakeAsync(() => {
    const saveAccountSpy = jest.spyOn(component, 'saveAccount').mockImplementation(() => {});
    const closeFormSpy = jest.spyOn(component, 'closeForm').mockImplementation(() => {});
    const loadCustomersSpy = jest.spyOn(component, 'loadCustomers').mockImplementation(() => {});

    // MUY IMPORTANTE: setear datos necesarios antes de llamar
    component.nuevoCliente.name = 'John Doe';
    component.nuevoCliente.identification = '1234567890';
    component.nuevoCliente.gender = 'M';
    component.nuevoCliente.age = '30';
    component.nuevoCliente.address = 'Some address';
    component.nuevoCliente.phone = '123456789';
    component.nuevoCliente.password = 'password123';

    component.saveCustomer();
    tick();
    fixture.detectChanges();

    expect(customerServiceMock.createCustomer).toHaveBeenCalled();
    expect(saveAccountSpy).toHaveBeenCalled();
    expect(closeFormSpy).toHaveBeenCalled();
    expect(loadCustomersSpy).toHaveBeenCalled();
  }));

  it('should call createAccount and close form when saving account', fakeAsync(() => {
    const closeFormSpy = jest.spyOn(component, 'closeForm').mockImplementation(() => {});

    component.nuevoCliente.accountType = 'Savings';
    component.nuevoCliente.balance = '1000';

    component.saveAccount();
    tick();
    fixture.detectChanges();

    expect(accountServiceMock.createAccount).toHaveBeenCalled();
    expect(closeFormSpy).toHaveBeenCalled();
  }));

  it('should delete a customer if confirmed', fakeAsync(() => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    component.clientes = [{ name: 'Test', identification: '123' }];
    component.eliminarCliente('123');

    tick();
    fixture.detectChanges();

    expect(customerServiceMock.deleteCustomer).toHaveBeenCalledWith('123');
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

  it('should find a customer successfully', fakeAsync(() => {
    const mockCustomer = { name: 'Test User', identification: '1234567890' };
    customerServiceMock.findCustomer.mockReturnValueOnce(of(mockCustomer));

    component.findCustomer('1234567890');

    tick();
    fixture.detectChanges();

    expect(component.clientes.length).toBe(1);
    expect(component.clientes[0]).toEqual(mockCustomer);
    expect(component.errorMessage).toBe('');
  }));

  it('should not delete a customer if confirmation is cancelled', fakeAsync(() => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    component.clientes = [{ name: 'Test', identification: '123' }];
    component.eliminarCliente('123');

    tick();
    fixture.detectChanges();

    expect(customerServiceMock.deleteCustomer).not.toHaveBeenCalled();
    expect(component.clientes.length).toBe(1); // sigue igual
  }));

});
