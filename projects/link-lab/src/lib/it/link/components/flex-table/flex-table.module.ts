import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './flex-table.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CardComponent
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    TranslateModule
  ],
  exports: [
    CardComponent
  ]
})
export class FlexTableModule { }
