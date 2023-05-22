import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { BoxMessageComponent } from './box-message.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [BoxMessageComponent],
  declarations: [BoxMessageComponent]
})
export class BoxMessageModule {}
