import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-code-review-section',
  standalone: true,
  imports: [],
  templateUrl: './code-review-section.component.html',
  styleUrl: './code-review-section.component.scss'
})
export class CodeReviewSectionComponent {
  @Input() lowActivity: boolean = false;
  @Input() outdatedCode: boolean = false;
  @Input() poorDocumentation: boolean = false;
}
