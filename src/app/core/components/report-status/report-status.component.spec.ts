import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportStatusComponent } from './report-status.component';
import { ReportService } from '../../core/services/report.service';
import { ReportStatus } from '../../models/report-status.enum';
import { BehaviorSubject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

describe('ReportStatusComponent', () => {
  let component: ReportStatusComponent;
  let fixture: ComponentFixture<ReportStatusComponent>;
  let reportServiceMock: any;
  let reportStatusSubject: BehaviorSubject<ReportStatus>;

  beforeEach(async () => {
    reportStatusSubject = new BehaviorSubject<ReportStatus>(ReportStatus.IDLE);
    reportServiceMock = {
      reportStatus$: reportStatusSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [ReportStatusComponent, MatIconModule],
      providers: [{ provide: ReportService, useValue: reportServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display Idle status initially', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Report Status: Idle');
    expect(compiled.querySelector('mat-icon')?.textContent).toContain('watch_later');
  });

  it('should display Generating status', () => {
    reportStatusSubject.next(ReportStatus.GENERATING);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Report Status: Generating');
    expect(compiled.querySelector('mat-icon')?.textContent).toContain('hourglass_empty');
    expect(compiled.textContent).toContain('Generating Report...');
  });

  it('should display Generated status', () => {
    reportStatusSubject.next(ReportStatus.COMPLETED);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Report Status: Completed');
    expect(compiled.querySelector('mat-icon')?.textContent).toContain('check_circle');
    expect(compiled.textContent).toContain('Report Generated Successfully!');
  });

  it('should display Error status', () => {
    reportStatusSubject.next(ReportStatus.FAILED);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Report Status: Failed');
    expect(compiled.querySelector('mat-icon')?.textContent).toContain('error');
    expect(compiled.textContent).toContain('Error Generating Report.');
  });
});
