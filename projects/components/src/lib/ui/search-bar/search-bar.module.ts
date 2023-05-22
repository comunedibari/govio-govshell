import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { SearchBarComponent } from './search-bar.component';

@NgModule({
  declarations: [
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    SearchBarComponent
  ]
})
export class SearchBarModule { }
