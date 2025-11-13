import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportService, ReportError } from '../../core/services/report.service';
import { ReportStatusComponent } from '../../core/components/report-status/report-status.component';
import { Subject } from 'rxjs';
import { takeUntil, finalize, first, switchMap, filter } from 'rxjs/operators';
import { ReportStatus } from '../../models/report-status.enum';

function tokenFormatValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) {
    return null; // 'required' validator will handle empty
  }
  // Regex for alphanumeric characters, minimum 3 characters
  const isValidFormat = /^[a-zA-Z0-9]{3,}$/.test(value);
  return isValidFormat ? null : { invalidFormat: true };
}

@Component({
  selector: 'app-token-input-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, ReportStatusComponent],  templateUrl: './token-input-form.component.html',
  styleUrl: './token-input-form.component.scss',
})
export class TokenInputFormComponent implements OnDestroy {
  tokenForm: FormGroup;
  private destroy$ = new Subject<void>();
  loading = false;
  error: string | null = null;
  success = false;
  reportStatus: ReportStatus = ReportStatus.IDLE;
  reportError: ReportError | null = null;
  public ReportStatus = ReportStatus; // Make enum available in template

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    this.tokenForm = this.fb.group({
      token: ['', [Validators.required, tokenFormatValidator]],
    });

    this.reportService.reportStatus$.pipe(takeUntil(this.destroy$)).subscribe(status => {
      this.reportStatus = status;
      this.loading = status === ReportStatus.GENERATING;
      this.success = status === ReportStatus.SUCCESS;
      if (status === ReportStatus.ERROR) {
        // Error message will be set by reportError$ subscription
      } else {
        this.error = null;
        this.reportError = null;
      }
    });

    this.reportService.reportError$.pipe(takeUntil(this.destroy$)).subscribe(err => {
      this.reportError = err;
      this.error = err?.message || 'An unexpected error occurred.';
    });
  }

  get tokenInput() {
    return this.tokenForm.get('token');
  }

  onSubmit(isRetry: boolean = false): void {
    if (this.tokenForm.valid || isRetry) { // Allow retry even if form is not valid (e.g., after initial error)
      this.loading = true;
      this.error = null;
      this.success = false;
      this.reportError = null;

      const token = this.tokenForm.get('token')?.value;

      this.reportService.generateReport(token, isRetry).pipe(
        switchMap(() =>
          this.reportService.reportStatus$.pipe(
            filter(status => status === ReportStatus.SUCCESS || status === ReportStatus.ERROR),
            first()
          )
        ),
        takeUntil(this.destroy$),
        finalize(() => {
          // loading is now controlled by reportStatus$ subscription
        })
      ).subscribe({
        next: (status) => {
          if (status === ReportStatus.SUCCESS) {
            this.tokenForm.reset();
          }
          // Error handling is now primarily done via reportError$ subscription
        },
        error: (err) => {
          // This error block might catch errors not handled by reportError$ (e.g., network issues before API response)
          if (!this.reportError) { // Only set if reportError$ hasn't already provided a more specific error
            this.error = err.message || 'An unexpected error occurred during report generation.';
          }
          this.success = false;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRetryReport(): void {
    const token = this.tokenForm.get('token')?.value;
    if (token) {
      this.onSubmit(true);
    } else if (this.reportError && this.reportError.originalError && this.reportError.originalError.url) {
      // If token is not available in form (e.g., after reset on success), but we have a previous error with original request details
      // This part might need refinement based on how you want to handle retries without a token in the form after a success.
      // For now, we'll assume the token is still available in the form for retry scenarios.
      console.warn('Attempted to retry without a token in the form. This scenario might need specific handling.');
      // Optionally, re-enable the form or prompt the user for input.
    } else {
      console.error('Cannot retry: No token available and no previous error with request details.');
    }
  }
}
