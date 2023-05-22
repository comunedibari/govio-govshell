import { NgModule } from '@angular/core';
import { GroupComponent } from './group.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    GroupComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule
  ],
  exports: [
    GroupComponent
  ]
})
export class GroupModule { }
