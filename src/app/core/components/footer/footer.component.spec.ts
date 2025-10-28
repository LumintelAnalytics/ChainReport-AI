import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { environment } from '../../../../environments/environment';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the current year in the copyright notice', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const currentYear = new Date().getFullYear();
    expect(compiled.querySelector('footer p')?.textContent).toContain(`© ${currentYear} Lumintel Analytics. All rights reserved.`);
  });

  it('should display the application version', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('footer p:last-child')?.textContent).toContain(`Version: ${environment.version}`);
  });
});
