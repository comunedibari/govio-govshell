import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { BoxMessageComponent } from './box-message.component';

@NgModule({
  declarations: [
    BoxMessageComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    BoxMessageComponent
  ]
})
export class BoxMessageModule { }
