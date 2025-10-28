import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportStatusComponent } from './report-status.component';
import { ReportService } from '../../core/services/report.service';
import { ReportStatus } from '../../models/report-status.enum';
import { of, BehaviorSubject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

describe('ReportStatusComponent', () => {
  let component: ReportStatusComponent;
  let fixture: ComponentFixture<ReportStatusComponent>;
  let mockReportService: jasmine.SpyObj<ReportService>;
  let reportStatusSubject: BehaviorSubject<ReportStatus>;

  beforeEach(async () => {
    reportStatusSubject = new BehaviorSubject<ReportStatus>(ReportStatus.Idle);
    mockReportService = jasmine.createSpyObj('ReportService', [], { reportStatus$: reportStatusSubject.asObservable() });

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatIconModule,
        ReportStatusComponent // Import standalone component directly
      ],
      providers: [
        { provide: ReportService, useValue: mockReportService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Idle" status initially', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.report-status').textContent).toContain('Report Status: Idle');
    expect(compiled.querySelector('mat-icon').textContent).toContain('watch_later');
    expect(compiled.querySelector('.report-status').classList).toContain('Idle');
  });

  it('should display "Generating" status', () => {
    reportStatusSubject.next(ReportStatus.Generating);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.report-status').textContent).toContain('Report Status: Generating');
    expect(compiled.querySelector('mat-icon').textContent).toContain('hourglass_empty');
    expect(compiled.querySelector('.report-status').classList).toContain('Generating');
  });

  it('should display "Generated" status', () => {
    reportStatusSubject.next(ReportStatus.Generated);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.report-status').textContent).toContain('Report Status: Generated');
    expect(compiled.querySelector('mat-icon').textContent).toContain('check_circle');
    expect(compiled.querySelector('.report-status').classList).toContain('Generated');
  });

  it('should display "Error" status', () => {
    reportStatusSubject.next(ReportStatus.Error);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.report-status').textContent).toContain('Report Status: Error');
    expect(compiled.querySelector('mat-icon').textContent).toContain('error');
    expect(compiled.querySelector('.report-status').classList).toContain('Error');
  });
});
