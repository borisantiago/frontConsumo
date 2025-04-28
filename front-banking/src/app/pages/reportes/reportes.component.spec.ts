import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportesComponent } from './reportes.component';

describe('ReportesComponent', () => {
  let fixture: ComponentFixture<ReportesComponent>;
  let component: ReportesComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ReportesComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
