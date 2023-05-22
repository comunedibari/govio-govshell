import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabGroupComponent } from './fab-group.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    FabGroupComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [
    FabGroupComponent
  ]
})
export class FabGroupModule { }
