import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-report-view',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss']
})
export class ReportViewComponent implements OnInit {
  reportId: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.reportId = this.route.snapshot.paramMap.get('reportId');
    // In a real application, you would fetch report data here using reportId
    console.log('Report ID:', this.reportId);
  }
}
