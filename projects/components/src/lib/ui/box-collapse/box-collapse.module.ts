import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';
import { MarkdownModule } from 'ngx-markdown';

import { BoxCollapseComponent } from './box-collapse.component';

@NgModule({
  declarations: [
    BoxCollapseComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    MarkdownModule
  ],
  exports: [
    BoxCollapseComponent
  ]
})
export class BoxCollapseModule { }
