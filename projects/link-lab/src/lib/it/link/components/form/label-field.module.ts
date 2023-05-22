import { NgModule } from '@angular/core';
import { LabelFieldComponent } from './label-field.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    LabelFieldComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    LabelFieldComponent
  ]
})
export class LabelFieldModule { }
