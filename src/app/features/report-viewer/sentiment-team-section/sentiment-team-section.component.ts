import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SentimentReport, TeamReport } from '../../../models/sentiment-team.model'; // Assuming this path

@Component({
  selector: 'app-sentiment-team-section',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './sentiment-team-section.component.html',
  styleUrls: ['./sentiment-team-section.component.scss'],
})
export class SentimentTeamSectionComponent {
  @Input() sentimentReport: SentimentReport | undefined;
  @Input() teamReport: TeamReport | undefined;
}
