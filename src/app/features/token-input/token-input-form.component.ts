import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReportService } from '../../core/services/report.service';
import { ReportStatusComponent } from '../../core/components/report-status/report-status.component';

@Component({
  selector: 'app-token-input-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, ReportStatusComponent],  templateUrl: './token-input-form.component.html',
  styleUrl: './token-input-form.component.scss',
})
export class TokenInputFormComponent {
  tokenForm: FormGroup;

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
      this.reportService.generateReport(token).subscribe();
    }
  }
}
