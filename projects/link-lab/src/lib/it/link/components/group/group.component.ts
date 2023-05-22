import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuPositionX, MenuPositionY } from '@angular/material/menu';

@Component({
  selector: 'link-group',
  template: `
    <div [id]="'group'+ID" class="container group">
      <div class="row flex-nowrap" [id]="'triggerGroup'+ID" (click)="_onToggle(_expanded)" data-toggle="collapse" [attr.data-target]="'#groupContent'+ID"
           [attr.aria-expanded]="false" [attr.aria-controls]="'#groupContent'+ID">
        <div class="col-12">
          <div class="d-flex align-items-center">
            <i class="material-icons">{{ _groupIcon }}</i>
            <p class="flex-grow-1 group-title">{{ _title }}</p>
            <i class="material-icons-outlined ms-auto" *ngIf="_showTrigger">{{ (_expanded || open)?'expand_less':'expand_more' }}</i>
            <button mat-icon-button type="button" class="material-icons trigger-icon" *ngIf="_triggerIcon" (click)="_onTriggerIcon($event)">
              <i class="group-icon material-icons-outlined">{{ _triggerIcon }}</i>
            </button>
            <button mat-icon-button type="button" [matMenuTriggerFor]="SubMenu" class="material-icons-outlined trigger-icon"
                    *ngIf="!_triggerIcon && _showTriggerMenu" (click)="_onTriggerMenu($event)">
              <i class="group-icon material-icons-outlined">more_vert</i>
            </button>
          </div>
        </div>
      </div>
      <div [id]="'groupContent'+ID" [class]="'row collapse-area collapse'+(open?' show':'')" [attr.aria-labelledby]="'triggerGroup'+ID" [attr.data-parent]="'#group'+ID">
        <div class="col-12 collapse-content">
          <ng-content select="[group-content]"></ng-content>
        </div>
      </div>
    </div>
    <mat-menu #SubMenu="matMenu" [yPosition]="yPos" [xPosition]="xPos" [overlapTrigger]="overlapIcon">
      <ng-content select="[menu-group-content]"></ng-content>
    </mat-menu>
  `,
  styles: [`
    :host {
      display: block;
      background-color: transparent;
      border-radius: 8px;
      border-width: 1px;
      border-style: solid;
      padding: .5625rem .75rem;
    }
    :host {
      border-color: var(--group-border-color, #808080);
      margin-bottom: .5rem;
    }

    :host:hover {
      border-color: var(--group-border-color-hover, #696969);
    }

    .group {
      padding: 0;
    }

    .collapse-area {
      padding: 0 .875rem;
    }

    .collapse-content {
      padding: 1.125rem 0 0 0;
      margin: 0;
    }

    p.group-title {
      cursor: pointer;
      margin: 0 0 0 .5rem;
    }

    .trigger-icon .group-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class GroupComponent implements OnInit {
  @Input('groupIcon') _groupIcon: string = '';
  @Input('triggerIcon') _triggerIcon: string = '';
  @Input('title') _title: string = '';
  @Input('xPos') xPos: MenuPositionX = 'before';
  @Input('yPos') yPos: MenuPositionY = 'below';
  @Input('overlapIcon') overlapIcon: boolean = true;
  @Input('id') ID: string = '';
  @Input('showTrigger') _showTrigger: boolean = false;
  @Input('showTriggerMenu') _showTriggerMenu: boolean = false;
  @Input() open: boolean = false;

  @Output() onToggle: EventEmitter<any> = new EventEmitter();
  @Output() onTriggerIcon: EventEmitter<any> = new EventEmitter();

  _expanded: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  _onToggle(expanded: boolean) {
    this._expanded = !expanded;
    this.onToggle.emit({ expanded: !expanded });
  }

  _onTriggerIcon(event: any) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.onTriggerIcon.emit({ sourceEvt: event, target: this });
  }

  _onTriggerMenu(event: any) {
    event.stopImmediatePropagation();
  }
}
