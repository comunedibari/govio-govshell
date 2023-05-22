import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapseItemComponent } from './collapse-item.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    CollapseItemComponent
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatRippleModule
  ],
  exports: [
    CollapseItemComponent
  ]
})
export class CollapseItemModule { }
