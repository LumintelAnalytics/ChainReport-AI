import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TokenInputFormComponent } from './token-input-form.component';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReportService } from '../../core/services/report.service';
import { ReportStatusComponent } from '../../core/components/report-status/report-status.component';
import { of, Subject } from 'rxjs';
import { ReportStatus } from '../../models/report-status.enum';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TokenInputFormComponent', () => {
  let component: TokenInputFormComponent;
  let fixture: ComponentFixture<TokenInputFormComponent>;
  let mockReportService: jasmine.SpyObj<ReportService>;
  let reportStatusSubject: Subject<ReportStatus>;

  beforeEach(async () => {
    reportStatusSubject = new Subject<ReportStatus>();
    mockReportService = jasmine.createSpyObj('ReportService', ['startReportGeneration', 'getStatus']);
    mockReportService.getStatus.and.returnValue(reportStatusSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        NoopAnimationsModule, // Required for MatFormField animations
        TokenInputFormComponent // Import standalone component directly
      ],
      providers: [
        FormBuilder,
        { provide: ReportService, useValue: mockReportService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenInputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with a required token field', () => {
    expect(component.tokenForm).toBeDefined();
    expect(component.tokenInput).toBeDefined();
    expect(component.tokenInput?.hasError('required')).toBeTrue();
    expect(component.tokenForm.valid).toBeFalse();
  });

  it('should make the token input valid when a value is entered', () => {
    component.tokenInput?.setValue('test_token');
    expect(component.tokenInput?.valid).toBeTrue();
    expect(component.tokenForm.valid).toBeTrue();
  });

  it('should show required error when token input is touched and empty', () => {
    const tokenInput = component.tokenInput;
    tokenInput?.markAsTouched();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const errorElement = compiled.querySelector('mat-error');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('Token input is required.');
  });

  it('should call startReportGeneration and set loading to true on submit', () => {
    component.tokenInput?.setValue('test_token');
    component.onSubmit();
    expect(mockReportService.startReportGeneration).toHaveBeenCalled();
    expect(component.loading).toBeTrue();
  });

  it('should set success to true and reset form when report completes', () => {
    component.tokenInput?.setValue('test_token');
    component.onSubmit();

    reportStatusSubject.next(ReportStatus.COMPLETED);
    fixture.detectChanges();

    expect(component.success).toBeTrue();
    expect(component.loading).toBeFalse();
    expect(component.tokenInput?.value).toBeNull(); // Form should be reset
  });

  it('should set error message when report fails', () => {
    component.tokenInput?.setValue('test_token');
    component.onSubmit();

    reportStatusSubject.next(ReportStatus.FAILED);
    fixture.detectChanges();

    expect(component.error).toBe('Report generation failed');
    expect(component.loading).toBeFalse();
    expect(component.success).toBeFalse();
  });

  it('should complete the destroy$ subject on ngOnDestroy', () => {
    const destroySpy = spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });
});