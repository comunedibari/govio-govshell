import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleItemComponent } from './simple-item.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    SimpleItemComponent
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatRippleModule
  ],
  exports: [
    SimpleItemComponent
  ]
})
export class SimpleItemModule { }
