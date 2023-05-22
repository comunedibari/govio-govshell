import { NgModule } from '@angular/core';
import { TitleDecoComponent } from './title-deco.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    TitleDecoComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    TitleDecoComponent
  ]
})
export class TitleDecoModule { }
