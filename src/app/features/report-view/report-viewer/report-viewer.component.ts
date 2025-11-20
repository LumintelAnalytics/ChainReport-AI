import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-viewer',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './report-viewer.component.html',
  styleUrl: './report-viewer.component.scss',
})
export class ReportViewerComponent implements OnInit {
  reportId: string | null = null;
  layoutView: 'tabs' | 'sidebar' = 'tabs'; // Default to tabs view

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.reportId = params.get('reportId');
    });
  }

  toggleLayout(): void {
    this.layoutView = this.layoutView === 'tabs' ? 'sidebar' : 'tabs';
  }
}
