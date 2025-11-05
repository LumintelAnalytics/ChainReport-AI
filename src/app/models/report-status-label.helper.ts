
import { ReportStatus } from './report-status.enum';

export function getReportStatusLabel(status: ReportStatus): string {
  switch (status) {
    case ReportStatus.IDLE:
      return 'Idle';
    case ReportStatus.GENERATING:
      return 'Generating';
    case ReportStatus.COMPLETED:
      return 'Completed';
    case ReportStatus.FAILED:
      return 'Failed';
    default:
      return 'Unknown';
  }
}
