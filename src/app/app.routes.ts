import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { ReportViewerComponent } from './features/report-view/report-viewer/report-viewer.component';
import { TokenomicsComponent } from './features/report-view/components/tokenomics/tokenomics.component';
import { SentimentComponent } from './features/report-view/components/sentiment/sentiment.component';
import { TeamComponent } from './features/report-view/components/team/team.component';
import { ChainDataComponent } from './features/report-view/components/chain-data/chain-data.component';
import { WhitepaperReviewSectionComponent } from './features/report-viewer/whitepaper-review-section/whitepaper-review-section.component';
import { OnchainMetricsSectionComponent } from './features/report-viewer/onchain-metrics-section/onchain-metrics-section.component';
import { CodeReviewSectionComponent } from './features/report-viewer/code-review-section/code-review-section.component';
import { AuditReviewSectionComponent } from './features/report-viewer/audit-review-section/audit-review-section.component';
import { SentimentTeamSectionComponent } from './features/report-viewer/sentiment-team-section/sentiment-team-section.component';
import { FinalSummaryComponent } from './features/report-viewer/final-summary/final-summary.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: MainLayoutComponent },
      { path: 'generate-report', component: MainLayoutComponent },
      { path: 'settings', component: MainLayoutComponent },
      {
        path: 'report/:reportId',
        component: ReportViewerComponent,
        children: [
          { path: 'tokenomics', component: TokenomicsComponent },
          { path: 'sentiment', component: SentimentComponent },
          { path: 'team', component: TeamComponent },
          { path: 'whitepaper-review', component: WhitepaperReviewSectionComponent },
          { path: 'onchain-metrics', component: OnchainMetricsSectionComponent },
          { path: 'code-review', component: CodeReviewSectionComponent },
          { path: 'audit-review', component: AuditReviewSectionComponent },
          { path: 'sentiment-team', component: SentimentTeamSectionComponent },
          { path: 'chain-data', component: ChainDataComponent },
          { path: 'final-summary', component: FinalSummaryComponent },
          { path: '', redirectTo: 'tokenomics', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];
