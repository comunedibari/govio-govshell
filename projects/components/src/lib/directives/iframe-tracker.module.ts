import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IframeTrackerDirective } from './iframe-tracker.directive';

@NgModule({
  declarations: [
    IframeTrackerDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IframeTrackerDirective
  ]
})
export class IframeTrackerModule { }
