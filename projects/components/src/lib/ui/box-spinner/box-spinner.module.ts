import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BoxSpinnerComponent } from './box-spinner.component';

@NgModule({
  declarations: [
    BoxSpinnerComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  exports: [
    BoxSpinnerComponent
  ]
})
export class BoxSpinnerModule { }
