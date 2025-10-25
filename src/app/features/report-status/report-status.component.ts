import { Component, Input } from '@angular/core';
import { ReportStatus } from 'src/app/models/report-status.enum';

@Component({
  selector: 'app-report-status',
  templateUrl: './report-status.component.html',
  styleUrls: ['./report-status.component.scss']
})
export class ReportStatusComponent {
<<<<<<< HEAD
  @Input() reportStatus: ReportStatus = ReportStatus.INITIAL;
=======
  @Input() status: ReportStatus = ReportStatus.INITIAL;
>>>>>>> 00890c3 (feat: Define ReportStatus enum and integrate into component)
}
