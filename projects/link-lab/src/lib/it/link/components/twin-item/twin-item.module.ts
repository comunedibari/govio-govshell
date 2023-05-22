import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwinItemComponent } from './twin-item.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { SimpleItemModule } from '../simple-item/simple-item.module';

@NgModule({
  declarations: [
    TwinItemComponent
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatRippleModule,
    SimpleItemModule
  ],
  exports: [
    TwinItemComponent
  ]
})
export class TwinItemModule { }
