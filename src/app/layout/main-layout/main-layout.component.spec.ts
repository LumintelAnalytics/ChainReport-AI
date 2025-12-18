import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterOutlet,
        MatToolbarModule,
        HeaderComponent,
        FooterComponent
      ],
      declarations: [],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header and footer components', () => {
    const header = fixture.debugElement.query(By.directive(HeaderComponent));
    const footer = fixture.debugElement.query(By.directive(FooterComponent));
    expect(header).toBeTruthy();
    expect(footer).toBeTruthy();
  });

  it('should have a main content area with router-outlet', () => {
    const mainContent = fixture.debugElement.query(By.css('main.main-content'));
    expect(mainContent).toBeTruthy();
    const routerOutlet = mainContent.query(By.directive(RouterOutlet));
    expect(routerOutlet).toBeTruthy();
  });

  const setViewportWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
    window.dispatchEvent(new Event('resize'));
  };

  it('should apply mobile styles on small screens', () => {
    setViewportWidth(500); // Mobile size
    fixture.detectChanges();
    const mainContent = fixture.debugElement.query(By.css('main.main-content')).nativeElement;
    // We expect the padding to be 10px on small screens based on the CSS.
    // Note: getComputedStyle might not work perfectly in JSDOM for all CSS properties.
    // A more robust test might check for the presence of a specific class applied conditionally.
    // For this example, we'll try to check padding.
    const computedStyle = getComputedStyle(mainContent);
    expect(computedStyle.padding).toBe('10px');
  });

  it('should apply desktop styles on large screens', () => {
    setViewportWidth(1024); // Desktop size
    fixture.detectChanges();
    const mainContent = fixture.debugElement.query(By.css('main.main-content')).nativeElement;
    const computedStyle = getComputedStyle(mainContent);
    expect(computedStyle.padding).toBe('20px');
  });
});
