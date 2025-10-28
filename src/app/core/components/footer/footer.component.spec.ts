import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { environment } from '../../../../environments/environment';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the current year', () => {
    const compiled = fixture.nativeElement;
    const currentYear = new Date().getFullYear();
    expect(compiled.querySelector('p').textContent).toContain(`© ${currentYear} Lumintel Analytics. All rights reserved.`);
  });

  it('should display the version from the environment', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('p')[1].textContent).toContain(`Version: ${environment.version}`);
  });
});
