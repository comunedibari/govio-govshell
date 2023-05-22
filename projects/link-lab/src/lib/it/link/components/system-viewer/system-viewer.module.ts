import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemViewerComponent } from './system-viewer.component';

@NgModule({
  declarations: [
    SystemViewerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SystemViewerComponent
  ]
})
export class SystemViewerModule { }
