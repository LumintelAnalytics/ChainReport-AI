import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-viewer',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './report-viewer.component.html',
  styleUrl: './report-viewer.component.scss',
})
export class ReportViewerComponent {
  reportId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.reportId = this.route.snapshot.paramMap.get('reportId');
  }
}
