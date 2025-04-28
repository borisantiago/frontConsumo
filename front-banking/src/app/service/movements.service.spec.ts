import { TestBed } from '@angular/core/testing';
import { MovementsService } from './movements.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MovementsService', () => {
  let service: MovementsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(MovementsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden requests pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should visualize movements', () => {
    const dummyMovements = { movements: [{ amount: 100 }, { amount: 200 }] };
    const identification = '123';
    const start = '2024-01-01';
    const end = '2024-01-31';

    service.visualizarMovements(identification, start, end).subscribe(response => {
      expect(response).toEqual(dummyMovements);
    });

    const req = httpMock.expectOne(`http://localhost:8080/v1/find-customer-by-date?id=123&startDate=2024-01-01&endDate=2024-01-31`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyMovements);
  });

  it('should create a movement', () => {
    const movimiento = { accountNumber: '123456', amount: 100 };

    service.createMovement(movimiento).subscribe(response => {
      expect(response).toEqual(movimiento);
    });

    const req = httpMock.expectOne('http://localhost:8080/v1/add-movements');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(movimiento);
    req.flush(movimiento);
  });
});
