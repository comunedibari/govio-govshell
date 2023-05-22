import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

import { BreadcrumbService } from './breadcrumb.service';
import { BreadcrumbComponent } from './breadcrumb.component';

@NgModule({
  declarations: [
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule
  ],
  exports: [
    BreadcrumbComponent
  ],
  providers: [
    BreadcrumbService
  ]
})
export class BreadcrumbModule { }
