import { Component, Input } from '@angular/core';
import { ReportStatus } from 'src/app/models/report-status.enum';

@Component({
  selector: 'app-report-status',
  templateUrl: './report-status.component.html',
  styleUrls: ['./report-status.component.scss']
})
export class ReportStatusComponent {
  @Input() reportStatus: ReportStatus = ReportStatus.INITIAL;
}
