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

  it('should display privacy policy link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const privacyLink = compiled.querySelector('.footer-links a:nth-child(1)') as HTMLAnchorElement;
    expect(privacyLink).toBeTruthy();
    expect(privacyLink.textContent).toContain('Privacy Policy');
    expect(privacyLink.href).toContain('https://www.example.com/privacy');
    expect(privacyLink.target).toBe('_blank');
    expect(privacyLink.rel).toBe('noopener noreferrer');
  });

  it('should display terms of service link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const termsLink = compiled.querySelector('.footer-links a:nth-child(2)') as HTMLAnchorElement;
    expect(termsLink).toBeTruthy();
    expect(termsLink.textContent).toContain('Terms of Service');
    expect(termsLink.href).toContain('https://www.example.com/terms');
    expect(termsLink.target).toBe('_blank');
    expect(termsLink.rel).toBe('noopener noreferrer');
  });
});
