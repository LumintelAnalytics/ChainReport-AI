import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReportService } from '../../core/services/report.service';
import { ReportStatusComponent } from '../../core/components/report-status/report-status.component';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-token-input-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, ReportStatusComponent],  templateUrl: './token-input-form.component.html',
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
      const token = this.tokenForm.get('token')?.value;
      this.loading = true;
      this.error = null;
      this.success = false;

      this.reportService.generateReport(token)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => { this.loading = false; })
        )
        .subscribe({
          next: () => {
            this.success = true;
            this.tokenForm.reset();
          },
          error: (err) => {
            console.error('Failed to generate report:', err);
            this.error = 'Failed to generate report. Please try again.';
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
