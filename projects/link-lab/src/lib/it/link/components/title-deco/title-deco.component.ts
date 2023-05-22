import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { MenuPositionX, MenuPositionY } from '@angular/material/menu';

@Component({
  selector: 'link-title-deco',
  template: `
    <div class="d-block">
      <div class="art-deco"></div>
      <div class="art-title d-flex flex-nowrap align-items-start">
        <h1 class="m-0 me-3">{{ title }}</h1>
        <button class="ms-auto" mat-icon-button type="button" *ngIf="!simple && !useMenu" type="button" (click)="_onIconClick($event)"><mat-icon fontSet="material-icons-outlined">{{ icon }}</mat-icon></button>
        <button class="ms-auto" mat-icon-button type="button" *ngIf="!simple && useMenu" type="button" [matMenuTriggerFor]="menu"><mat-icon fontSet="material-icons-outlined">{{ icon }}</mat-icon></button>
        <button class="ms-3" mat-icon-button type="button" *ngIf="!simple && !useMenu && enableFullScreen" type="button" (click)="_onFullScreenToggle($event)">
          <mat-icon fontSet="material-icons-outlined">{{ _expanded?'fullscreen_exit':'fullscreen' }}</mat-icon>
        </button>
        <mat-menu #menu="matMenu" [yPosition]="yPosition" [xPosition]="xPosition">
          <button mat-menu-item type="button" *ngFor="let act of actions" type="button" (click)="_onActionClick(act)">{{ act.label }}</button>
        </mat-menu>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      margin-bottom: 3rem;
    }

    :host .icon {
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      -webkit-user-drag: none;
      -webkit-tap-highlight-color: transparent;
    }

    .art-deco {
      max-width: 100%;
      height: 2px;
      margin-bottom: 1rem;
      background-color: var(--art-deco-color, #000);
    }

    .art-title {
      min-height: 40px;
    }
  `]
})
export class TitleDecoComponent implements OnInit {

  @Input() simple: boolean = true;
  @Input() useMenu: boolean = false;
  @Input() enableFullScreen: boolean = false;
  @Input() title: string = '';
  @Input() icon: string = 'more_vert';
  @Input() actions: DecoAction[] = [];

  @Input() xPosition: MenuPositionX = 'after';
  @Input() yPosition: MenuPositionY = 'below';

  @Output() iconClickEvt: EventEmitter<any> = new EventEmitter();
  @Output() actionClickEvt: EventEmitter<any> = new EventEmitter();
  @Output() expandClickEvt: EventEmitter<any> = new EventEmitter();

  _expanded: boolean = false;

  constructor(private hostElement: ElementRef) { }

  ngOnInit() {
  }

  _onIconClick(_event: any) {
    if (!this.simple && this.icon !== 'more_vert') {
      this.iconClickEvt.emit({ event: _event, type: this.icon });
    }
  }

  _onActionClick(_event: any) {
    if (!this.simple && this.useMenu) {
      this.actionClickEvt.emit(_event);
    }
  }

  _onFullScreenToggle(event: any) {
    if (this.enableFullScreen) {
      this._expanded = !this._expanded;
      this.expandClickEvt.emit({ expanded: this._expanded, element: this.hostElement.nativeElement });
    }
  }

  setTitle(_title: string) {
    this.title = _title;
  }

}

export class DecoAction {

  value: any;
  label: string = '';
  cssClass?: string[] = [];

  constructor(json: any) {
    if (json) {
      this.label = json.label || '';
      this.value = json.value || '';
      this.cssClass = json.cssClass || [];
    }
  }
}

