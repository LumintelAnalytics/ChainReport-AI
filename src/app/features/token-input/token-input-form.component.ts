import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportService } from '../../core/services/report.service';
import { ReportStatusComponent } from '../../core/components/report-status/report-status.component';
import { Subject } from 'rxjs';
import { takeUntil, finalize, first } from 'rxjs/operators';
import { ReportStatus } from '../../models/report-status.enum';

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

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    this.tokenForm = this.fb.group({
      token: ['', Validators.required],
    });
  }

  get tokenInput() {
    return this.tokenForm.get('token');
  }

  onSubmit(): void {
    if (this.tokenForm.valid) {
      this.loading = true;
      this.error = null;
      this.success = false;

      const token = this.tokenForm.get('token')?.value;
      if (!token) {
        this.error = 'Token is required.';
        return;
      }

      this.reportService.generateReport(token)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => { this.loading = false; })
        )
        .subscribe({
          next: () => {
            // ReportService handles status updates internally, we just need to react to them
            this.reportService.reportStatus$
              .pipe(
                first(status => status === ReportStatus.SUCCESS || status === ReportStatus.ERROR),
                takeUntil(this.destroy$)
              )
              .subscribe(status => {
                if (status === ReportStatus.SUCCESS) {
                  this.success = true;
                  this.tokenForm.reset();
                } else if (status === ReportStatus.ERROR) {
                  this.error = 'Report generation failed.';
                }
              });
          },
          error: (err) => {
            this.error = err.message || 'An unexpected error occurred during report generation.';
            this.success = false;
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
