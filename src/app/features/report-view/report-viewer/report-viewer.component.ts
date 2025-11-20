import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReportService } from '../../../core/services/report.service';
import { FinalReportData } from '../../../models/report-api.models';
import { Subscription, switchMap, tap, of } from 'rxjs';

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

  constructor(private route: ActivatedRoute, private reportService: ReportService) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.isLoading = true;
          this.error = null;
          this.reportData = null; // Clear previous report data
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
}
