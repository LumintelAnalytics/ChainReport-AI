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
import { ReportStatus } from '../../models/report-status.enum';

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
<<<<<<< HEAD
=======
      // const token = this.tokenForm.get('token')?.value; // Token is not needed for startReportGeneration
>>>>>>> c620bf2 (feat: Implement ReportService for status management)
      this.loading = true;
      this.error = null;
      this.success = false;

      this.reportService.startReportGeneration();
<<<<<<< HEAD
      this.reportService.getStatus()
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => { this.loading = false; })
        )
        .subscribe(status => {
          if (status === ReportStatus.COMPLETED) {
            this.success = true;
            this.tokenForm.reset();
          } else if (status === ReportStatus.FAILED) {
            this.error = 'Report generation failed';
          }
        });
=======
      // The service will handle status updates, so we just reset the form and set success here.
      // The loading state will be managed by the ReportStatusComponent subscribing to the service.
      this.success = true;
      this.tokenForm.reset();
      this.loading = false; // Reset loading immediately after starting generation
>>>>>>> c620bf2 (feat: Implement ReportService for status management)
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
