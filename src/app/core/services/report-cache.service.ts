import { Injectable } from '@angular/core';
import { ChainReport } from '../../models/chain-report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportCacheService {
  private reportCache: Map<string, ChainReport> = new Map<string, ChainReport>();

  constructor() { }

  setCachedReport(reportId: string, report: ChainReport): void {
    this.reportCache.set(reportId, report);
  }

  getCachedReport(reportId: string): ChainReport | undefined {
    return this.reportCache.get(reportId);
  }

  clearCache(): void {
    this.reportCache.clear();
    console.log('Report cache cleared.');
  }

  clearReport(reportId: string): void {
    this.reportCache.delete(reportId);
    console.log(`Report with ID ${reportId} cleared from cache.`);
  }
}
