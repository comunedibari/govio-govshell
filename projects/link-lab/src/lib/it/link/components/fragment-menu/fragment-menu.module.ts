import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FragmentMenuComponent } from './fragment-menu.component';

@NgModule({
  declarations: [
    FragmentMenuComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FragmentMenuComponent
  ]
})
export class FragmentMenuModule { }
