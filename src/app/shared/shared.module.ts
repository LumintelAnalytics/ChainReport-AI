import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    DisclaimerComponent
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    DisclaimerComponent
  ]
})
export class SharedModule { }
