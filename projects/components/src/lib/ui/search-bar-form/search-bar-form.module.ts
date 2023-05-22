import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

import { SearchBarFormComponent } from './search-bar-form.component';

@NgModule({
  declarations: [
    SearchBarFormComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule
  ],
  exports: [
    SearchBarFormComponent
  ]
})
export class SearchBarFormModule { }
