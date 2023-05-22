import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepeaterComponent } from './repeater.component';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    RepeaterComponent,
  ],
  imports: [
    CommonModule,
    MatRippleModule
  ],
  exports: [
    RepeaterComponent
  ]
})
export class RepeaterModule { }
