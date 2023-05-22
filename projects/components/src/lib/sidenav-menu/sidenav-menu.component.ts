import { Component, OnInit, Output, EventEmitter, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-sidenav-menu',
  template: `
    <mat-toolbar color="primary" class="py-4"><span [attr.title]="Tools.Versione">{{Tools.Options.SideMenu.Titolo}}</span></mat-toolbar>
    <div class="menu-list">
      <mat-list role="list">
        <mat-list-item role="listitem">MENU 1</mat-list-item>
      </mat-list>
      <mat-divider class="my-3"></mat-divider>
      <mat-list role="list">
        <mat-list-item role="listitem">MENU 2</mat-list-item>
      </mat-list>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    mat-toolbar {
      position: absolute;
      z-index: 1;
    }

    .menu-list {
      position: relative;
      padding-top: 64px;
    }

    mat-divider {
      opacity: .2;
    }

    mat-list-item {
      cursor: pointer;
    }
  `]
})
export class SidenavMenuComponent implements OnInit, AfterContentChecked {

  @Output() routingToEvt: EventEmitter<any> = new EventEmitter();


  constructor() { }

  ngOnInit() {
  }

  ngAfterContentChecked() {
  }
}
