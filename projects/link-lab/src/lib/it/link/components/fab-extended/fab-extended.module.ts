import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabExtendedComponent } from './fab-extended.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    FabExtendedComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    FabExtendedComponent
  ]
})
export class FabExtendedModule { }
