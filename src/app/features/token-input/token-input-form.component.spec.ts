import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TokenInputFormComponent } from './token-input-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReportService } from '../../core/services/report.service';
import { ReportStatus } from '../../models/report-status.enum';
import { BehaviorSubject } from 'rxjs';

describe('TokenInputFormComponent', () => {
  let component: TokenInputFormComponent;
  let fixture: ComponentFixture<TokenInputFormComponent>;
  let reportService: ReportService;
  let reportStatusSubject: BehaviorSubject<ReportStatus>;

  beforeEach(async () => {
    reportStatusSubject = new BehaviorSubject<ReportStatus>(ReportStatus.IDLE);
    const reportServiceMock = {
      startReportGeneration: jasmine.createSpy('startReportGeneration'),
      getStatus: () => reportStatusSubject.asObservable(),
      reportStatus$: reportStatusSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [TokenInputFormComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
      providers: [{ provide: ReportService, useValue: reportServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenInputFormComponent);
    component = fixture.componentInstance;
    reportService = TestBed.inject(ReportService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a required token control within the form group', () => {
    const tokenControl = component.tokenForm.get('token');
    expect(tokenControl?.valid).toBeFalse();
    tokenControl?.setValue('test');
    expect(tokenControl?.valid).toBeTrue();
  });

  it('should display required error when token input is empty', () => {
    const tokenControl = component.tokenForm.get('token');
    tokenControl?.setValue('');
    tokenControl?.markAsTouched();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-error')).toBeTruthy();
    expect(compiled.querySelector('mat-error')?.textContent).toContain('Token input is required.');
  });

  it('should call startReportGeneration and set loading to true on valid submit', fakeAsync(() => {
    component.tokenForm.get('token')?.setValue('test-token');
    component.onSubmit();
    tick();
    expect(reportService.startReportGeneration).toHaveBeenCalled();
    expect(component.loading).toBeTrue();
    expect(component.success).toBeFalse();
    expect(component.error).toBeNull();
  }));

  it('should set success to true and reset form on report completion', fakeAsync(() => {
    component.tokenForm.get('token')?.setValue('test-token');
    component.onSubmit();
    tick();
    reportStatusSubject.next(ReportStatus.SUCCESS);
    tick();
    expect(component.success).toBeTrue();
    expect(component.loading).toBeFalse();
    expect(component.tokenForm.get('token')?.value).toBeNull(); // Form should be reset
  }));

  it('should set error on report failure', fakeAsync(() => {
    component.tokenForm.get('token')?.setValue('test-token');
    component.onSubmit();
    tick();
    reportStatusSubject.next(ReportStatus.ERROR);
    tick();
    expect(component.error).toBe('Report generation failed');
    expect(component.loading).toBeFalse();
    expect(component.success).toBeFalse();
  }));

  it('should clear loading when component is destroyed', fakeAsync(() => {
    component.tokenForm.get('token')?.setValue('test-token');
    component.onSubmit();
    tick();
    expect(component.loading).toBeTrue();
    component.ngOnDestroy();
    tick();
    expect(component.loading).toBeFalse();
  }));

  it('should disable the submit button when the form is invalid', () => {
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTrue();
    component.tokenForm.get('token')?.setValue('valid-token');
    fixture.detectChanges();
    expect(submitButton.disabled).toBeFalse();
  });

  it('should disable the submit button when loading is true', fakeAsync(() => {
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    component.tokenForm.get('token')?.setValue('valid-token');
    fixture.detectChanges();
    expect(submitButton.disabled).toBeFalse();
    component.onSubmit();
    tick();
    fixture.detectChanges();
    expect(submitButton.disabled).toBeTrue();
  }));

  it('should have initial loading, error, and success states as false/null', () => {
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
    expect(component.success).toBeFalse();
  });
});
