import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AccountsService } from './accounts.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('AccountsService', () => {
  let service: AccountsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AccountsService]
    });

    service = TestBed.inject(AccountsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose correct apiUrl', () => {
    expect((service as any).apiUrl).toEqual('http://localhost:8080');
  });

  it('should expose correct headers in httpOptions', () => {
    const headers = (service as any).httpOptions.headers;
    expect(headers.get('Content-Type')).toEqual('application/json');
    expect(headers.get('x-guid')).toEqual('550e8777-e29b-41d4-a716-446655440000');
    expect(headers.get('x-device')).toEqual('12354');
    expect(headers.get('x-device-ip')).toEqual('192.168.7.7');
    expect(headers.get('x-session')).toEqual('dsds1212');
  });

  it('should create an account (POST)', () => {
    const mockAccount = { accountType: 'AHORROS', balance: 1000 };
    const mockResponse = { success: true };

    service.createAccount(mockAccount).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/v1/add-account');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockAccount);

    req.flush(mockResponse);
  });

  it('should handle error when createAccount fails', () => {
    const mockAccount = { accountType: 'AHORROS', balance: 1000 };

    service.createAccount(mockAccount).subscribe({
      next: () => fail('Should have failed with 500 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/v1/add-account');
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should delete an account (GET)', () => {
    const mockResponse = { success: true };
    const accountId = '12345';

    service.deleteAccount(accountId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:8080/v1/delete-account?id=${accountId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });

  it('should handle error when deleteAccount fails', () => {
    const accountId = '12345';

    service.deleteAccount(accountId).subscribe({
      next: () => fail('Should have failed with 404 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`http://localhost:8080/v1/delete-account?id=${accountId}`);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

});
