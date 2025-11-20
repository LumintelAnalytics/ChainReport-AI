import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReportService } from '../../../core/services/report.service';
import { FinalReportData } from '../../../models/report-api.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-report-viewer',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatButtonModule, MatIconModule, MatListModule, RouterModule],
  templateUrl: './report-viewer.component.html',
  styleUrl: './report-viewer.component.scss',
})
export class ReportViewerComponent implements OnInit {
  reportId: string | null = null;
  layoutView: 'tabs' | 'sidebar' = (localStorage.getItem('reportLayoutView') as 'tabs' | 'sidebar') || 'tabs'; // Default to tabs view
  reportData: FinalReportData | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  private reportSubscription: Subscription | undefined;

  constructor(private route: ActivatedRoute, private reportService: ReportService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.reportId = params.get('reportId');
      if (this.reportId) {
        this.fetchReportData(this.reportId);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.reportSubscription) {
      this.reportSubscription.unsubscribe();
    }
  }

  private fetchReportData(reportId: string): void {
    this.isLoading = true;
    this.error = null;
    this.reportSubscription = this.reportService.getFinalReport(reportId).subscribe({
      next: (data: FinalReportData) => {
        this.reportData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load report.';
        this.isLoading = false;
      }
    });
  }

  toggleLayout(): void {
    this.layoutView = this.layoutView === 'tabs' ? 'sidebar' : 'tabs';
    localStorage.setItem('reportLayoutView', this.layoutView);
  }
}
