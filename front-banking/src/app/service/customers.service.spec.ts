import { TestBed } from '@angular/core/testing';
import { CustomersService } from './customers.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CustomersService', () => {
  let service: CustomersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CustomersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya llamadas HTTP pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get customers', () => {
    const dummyCustomers = [{ name: 'John Doe' }, { name: 'Jane Doe' }];

    service.getCustomers().subscribe(customers => {
      expect(customers.length).toBe(2);
      expect(customers).toEqual(dummyCustomers);
    });

    const req = httpMock.expectOne('http://localhost:8080/v1/customers');
    expect(req.request.method).toBe('GET');
    req.flush(dummyCustomers);
  });

  it('should find a customer', () => {
    const searchValue = { identification: '123' };
    const dummyCustomer = { name: 'John Doe' };

    service.findCustomer(searchValue).subscribe(customer => {
      expect(customer).toEqual(dummyCustomer);
    });

    const req = httpMock.expectOne('http://localhost:8080/v1/find-customer');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(searchValue);
    req.flush(dummyCustomer);
  });

  it('should create a customer', () => {
    const newCustomer = { name: 'New Customer' };

    service.createCustomer(newCustomer).subscribe(response => {
      expect(response).toEqual(newCustomer);
    });

    const req = httpMock.expectOne('http://localhost:8080/v1/add-customer');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCustomer);
    req.flush(newCustomer);
  });

  it('should update a customer', () => {
    const id = '123';
    const updatedCustomer = { name: 'Updated', identification: '123' };
  
    service.updateCustomer(updatedCustomer).subscribe(response => {
      expect(response).toEqual(updatedCustomer);
    });
  
    // CORREGIR AQUÍ: Esperar la URL correcta
    const req = httpMock.expectOne(`http://localhost:8080/v1/update-customer`);
  
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(updatedCustomer);
  
    req.flush(updatedCustomer);
  });

  it('should delete a customer', () => {
    const id = '123';

    service.deleteCustomer(id).subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`http://localhost:8080/v1/delete-customer?id=${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
