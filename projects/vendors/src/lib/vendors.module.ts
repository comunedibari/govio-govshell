import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { MarkdownModule } from 'ngx-markdown';
import { GravatarModule, GravatarConfig, FALLBACK, RATING } from 'ngx-gravatar';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const gravatarConfig: GravatarConfig = {
  fallback: FALLBACK.mm,
  rating: RATING.g,
  backgroundColor: 'rgba(255, 255, 255, 1)',
  borderColor: 'rgba(255, 255, 255, 1)',
  hasBorder: true, // Set this flag to true to have a border by default
};

import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    MarkdownModule.forRoot(),
    GravatarModule.forRoot(gravatarConfig),
    InfiniteScrollModule,
    NgxChartsModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    TooltipModule,
    ModalModule,
    MarkdownModule,
    GravatarModule,
    InfiniteScrollModule,
    NgxChartsModule
  ],
})
export class VendorsModule {
}
