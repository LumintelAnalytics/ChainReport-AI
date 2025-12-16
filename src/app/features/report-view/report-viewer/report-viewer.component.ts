import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReportService } from '../../../core/services/report.service';
import { ReportCacheService } from '../../../core/services/report-cache.service';
import { FinalReportData } from '../../../models/report-api.models';
import { Subscription, switchMap, tap, of } from 'rxjs';
import { TokenomicsSectionComponent } from '../tokenomics-section/tokenomics-section.component';
import { OnchainMetricsSectionComponent } from '../../report-viewer/onchain-metrics-section/onchain-metrics-section.component';
import { CodeReviewSectionComponent } from '../../report-viewer/code-review-section/code-review-section.component';
import { WhitepaperReviewSectionComponent } from '../../report-viewer/whitepaper-review-section/whitepaper-review-section.component';
import { FinalSummaryComponent } from '../../report-viewer/final-summary/final-summary.component';
import { AuditReviewSectionComponent } from '../../report-viewer/audit-review-section/audit-review-section.component';
import { SentimentTeamSectionComponent } from '../../report-viewer/sentiment-team-section/sentiment-team-section.component';

@Component({
  selector: 'app-report-viewer',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatButtonModule, MatIconModule, MatListModule, RouterModule, TokenomicsSectionComponent, OnchainMetricsSectionComponent, CodeReviewSectionComponent, WhitepaperReviewSectionComponent, FinalSummaryComponent, AuditReviewSectionComponent, SentimentTeamSectionComponent],
  templateUrl: './report-viewer.component.html',
  styleUrl: './report-viewer.component.scss',
})
export class ReportViewerComponent implements OnInit {
  reportId: string | null = null;
  layoutView: 'tabs' | 'sidebar' = (localStorage.getItem('reportLayoutView') as 'tabs' | 'sidebar') || 'tabs'; // Default to tabs view
  reportData: FinalReportData | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  isDownloading: boolean = false; // Add this line

  constructor(private route: ActivatedRoute, private reportService: ReportService, private reportCacheService: ReportCacheService) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.isLoading = true;
          this.error = null;
          this.reportData = null; // Clear previous report data
          this.reportCacheService.clearCache(); // Clear cache when reportId changes
        }),
        switchMap(params => {
          this.reportId = params.get('reportId');
          if (!this.reportId) {
            this.isLoading = false;
            return of(null); // Return an observable of null if no reportId
          }
          return this.reportService.getFinalReport(this.reportId).pipe(
            tap({
              next: (data: FinalReportData) => {
                this.reportData = data;
                this.isLoading = false;
              },
              error: (err) => {
                this.error = err.message || 'Failed to load report.';
                this.isLoading = false;
              }
            })
          );
        })
      )
      .subscribe();
  }

  toggleLayout(): void {
    this.layoutView = this.layoutView === 'tabs' ? 'sidebar' : 'tabs';
    localStorage.setItem('reportLayoutView', this.layoutView);
  }

  downloadReport(): void {
    if (this.reportData && this.reportId) {
      this.isDownloading = true; // Set to true when download starts
      this.reportService.downloadFinalReport(this.reportId).subscribe({
        next: (response: Blob) => {
          const blob = new Blob([response], { type: 'application/pdf' }); // Assuming PDF, adjust if needed
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `report-${this.reportId}.pdf`; // Dynamic filename
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
          this.isDownloading = false; // Set to false on success
        },
        error: (err) => {
          this.error = err.message || 'Failed to download report.';
          console.error('Download error:', err);
          this.isDownloading = false; // Set to false on error
        }
      });
    } else {
      console.warn('Download Report button clicked but reportData or reportId is not available.');
    }
  }

  clearReportCache(): void {
    this.reportCacheService.clearCache();
  }
}
