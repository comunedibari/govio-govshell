import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

import { FormReadonlyComponent } from './form-readonly.component';

@NgModule({
  declarations: [
    FormReadonlyComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  exports: [
    FormReadonlyComponent
  ]
})
export class FormReadonlyModule { }
