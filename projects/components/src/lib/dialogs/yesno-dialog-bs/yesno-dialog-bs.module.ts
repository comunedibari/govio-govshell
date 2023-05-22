import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { YesnoDialogBsComponent } from './yesno-dialog-bs.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  entryComponents: [YesnoDialogBsComponent],
  exports: [YesnoDialogBsComponent],
  declarations: [YesnoDialogBsComponent]
})
export class YesnoDialogBsModule { }
