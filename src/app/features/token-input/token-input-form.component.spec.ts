import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TokenInputFormComponent } from './token-input-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TokenInputFormComponent', () => {
  let component: TokenInputFormComponent;
  let fixture: ComponentFixture<TokenInputFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenInputFormComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenInputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a required token control within the form group', () => {
    const tokenControl = component.tokenForm.get('token');
    expect(tokenControl?.valid).toBeFalse();
    tokenControl?.setValue('test');
    expect(tokenControl?.valid).toBeTrue();
  });

  it('should display required error when token input is empty', () => {
    const tokenControl = component.tokenForm.get('token');
    tokenControl?.setValue('');
    tokenControl?.markAsTouched();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-error')).toBeTruthy();
    expect(compiled.querySelector('mat-error')?.textContent).toContain('Token input is required.');
  });
});
