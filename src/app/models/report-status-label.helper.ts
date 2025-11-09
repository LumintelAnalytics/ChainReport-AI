
import { ReportStatus } from './report-status.enum';

export function getReportStatusLabel(status: ReportStatus): string {
  switch (status) {
    case ReportStatus.IDLE:
      return 'Idle';
    case ReportStatus.GENERATING:
      return 'Generating';
    case ReportStatus.SUCCESS:
      return 'Completed';
    case ReportStatus.ERROR:
      return 'Failed';
    default:
      return 'Unknown';
  }
}
