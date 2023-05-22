import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { EditColor, IBlock } from '../../classes/definitions';

@Component({
  selector: 'link-twin-item',
  template: `
    <div class="d-flex align-items-center">
      <div #si class="active-item d-flex flex-grow-1 align-items-center" (touchstart)="__swipe($event, 'start')" (touchend)="__swipe($event, 'end')">
        <div class="pl-3 pr-1 mb-n1" *ngIf="_editMode">
          <mat-checkbox class="edit-selector" [color]="_checkboxColor.toString()" [disabled]="_checkDisabled || __gestureDetect" (change)="__change($event)"></mat-checkbox>
        </div>
        <div class="flex-grow-1" (click)="__simpleClick($event, si)">
          <div class="d-flex flex-column flex-md-row main-data">
            <div class="flex-grow-1 mb-3 mb-md-0 primary-block">
              <p class="primary-text">{{ _primaryBlock.primaryText }}</p>
              <p class="secondary-text">{{ _primaryBlock.secondaryText }}</p>
            </div>
            <div class="flex-shrink-0 secondary-block" *ngIf="_secondaryBlock">
              <p class="primary-text">{{ _secondaryBlock.primaryText }}</p>
              <p class="secondary-text">{{ _secondaryBlock.secondaryText }}</p>
            </div>
          </div>
        </div>
      </div>
      <div matRipple [matRippleColor]="__ripple" role="button" [matRippleDisabled]="actionDisabled"
           [style.--simple-item-action-background-color]="_actionBackgroundColor"
           [style.--simple-item-hover-action-background-color]="_actionHoverColor"
           (click)="__simpleActionClick($event, _action)" [class]="__setClass()" *ngIf="_action">
        <i class="material-icons">{{ _action }}</i>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
      background-color: var(--twin-item-background-color, #fff);
      margin-bottom: .5rem;
    }

    :host:only-child,
    :host:last-child {
      margin-bottom: 0;
    }

    :host:hover {
      background-color: var(--twin-item-hover, #b0b0b0);
    }

    :host(.notify) .active-item:before {
      position: absolute;
      content: 'new_releases';
      font-family: 'Material Icons';
      width: 24px;
      height: 24px;
      line-height: 1;
      font-size: 1.5rem;
      color: var(--twin-item-notify-color, #ef9a9a);
      z-index: 2;
      left: -12px;
      top: calc(50% - 12px);
    }

    :host(.no-feedback):hover {
      background-color: var(--twin-item-background-color, #fff);
    }

    .active-item {
      display: block;
      position: relative;
      left: 0;
      z-index: 1;
      transition-property: left, background-color;
      transition-duration: .100s;
    }

    .active-item.swipe {
      position: relative;
      left: -48px;
      transition: left .100s linear;
      background-color: var(--twin-item-background-color, #fff);
    }

    .main-data .primary-block,
    .main-data .secondary-block {
      padding-top: .75rem;
      padding-bottom: .75rem;
    }

    .main-data .secondary-block {
      padding-left: .75rem;
      padding-right: .75rem;
    }

    .main-data .primary-block {
      padding-left: .75rem;
      padding-right: .75rem;
    }

    p {
      font-size: 1rem;
      line-height: 1.5;
      margin: 0 0 1rem 0;
      word-break: break-all;
    }

    p.primary-text {
      font-weight: 600;
      color: var(--twin-item-primary-text-color, inherit);
    }

    p.secondary-text {
      margin: 0;
      color: var(--twin-item-secondary-text-color, #333);
    }

    .action {
      padding: 0 .75rem;
      background-color: var(--twin-item-action-background-color, #fff);
    }

    .action i {
      color: var(--twin-item-action-color, #000);
    }

    .action:hover {
      background-color: var(--twin-item-hover-action-background-color, #333);
    }

    .action:hover i {
      color: var(--twin-item-hover-action-color, #000);
    }

    .draggable {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
      transition: opacity .100s linear;
    }

    :host .active-item.swipe ~ .draggable {
      opacity: 1;
      transition: opacity .200s linear;
    }

    .disabled {
      opacity: .75;
      cursor: default;
    }
  `]
})
export class TwinItemComponent implements OnInit {
  @HostBinding('class.notify') get notifyClass(): boolean {
    return this.notify;
  }
  @HostBinding('class.no-feedback') get noFeedbackClass(): boolean {
    return !this.hoverFeedback || this.__gestureDetect;
  }

  @Input('primaryBlock') _primaryBlock!: IBlock;
  @Input('secondaryBlock') _secondaryBlock!: IBlock;
  @Input('action') _action: string = '';
  @Input('checkDisabled') _checkDisabled: boolean = false;
  @Input('editMode') _editMode: boolean = false;
  @Input('actionBackgroundColor') _actionBackgroundColor: string = '';
  @Input('actionHoverColor') _actionHoverColor: string = '';
  @Input('checkboxColor') _checkboxColor!: EditColor;
  @Input() actionDisabled: boolean = false;
  @Input() notify: boolean = false;
  @Input() hoverFeedback: boolean = true;

  @Output() editSelection: EventEmitter<any> = new EventEmitter();
  @Output() simpleClick: EventEmitter<any> = new EventEmitter();
  @Output() simpleActionClick: EventEmitter<any> = new EventEmitter();
  @Output() swipeEvent: EventEmitter<any> = new EventEmitter();

  readonly keepTextFormat: boolean = false;
  __ripple: string = 'rgba(0,0,0,.05)';
  __hasGesture: boolean = false;
  __gestureDetect: boolean = false;
  __swipeCoord!: [ number, number ];
  __swipeTime!: number;

  constructor() { }

  ngOnInit() {
    this.__hasGesture = this.__hasTouchEvent();
  }

  __change(event: any) {
    this.editSelection.emit({ selected: event.checked, notify: this.notify });
  }

  __simpleClick(event: any, activeItem: any) {
    if (!this.__gestureDetect) {
      this.simpleClick.emit(event);
    } else {
      event.stopImmediatePropagation();
      event.preventDefault();
      this.__gestureDetect = false;
      if (activeItem.classList.contains('swipe')) {
        activeItem.classList.remove('swipe');
      }
    }
  }

  __simpleActionClick(event: any, type: string) {
    if (!this.actionDisabled) {
      this.simpleActionClick.emit({ event, type });
    } else {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }

  __setClass() {
    return {
      'd-flex': true,
      'flex-shrink-0': true,
      'align-self-stretch': true,
      'align-items-center': true,
      draggable: this.__hasGesture,
      action: true,
      disabled: this.actionDisabled
    };
  }

  __hasTouchEvent(): boolean {
    return 'ontouchstart' in document.documentElement;
  }

  __swipe(event: any, status: string): void {
    if (this.__hasGesture && this._action) {
      const coord: [ number, number ] = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
      const time = new Date().getTime();

      if (status === 'start') {
        this.__swipeCoord = coord;
        this.__swipeTime = time;
      } else if (status === 'end') {
        const direction = [coord[0] - this.__swipeCoord[0], coord[1] - this.__swipeCoord[1]];
        const duration = time - this.__swipeTime;
        if (duration < 1000 && Math.abs(direction[0]) > 30 && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
          const swipe = direction[0] < 0 ? 'left' : 'right';
          if (swipe === 'left') {
            event.currentTarget.classList.add('swipe');
            this.__gestureDetect = true;
            this.swipeEvent.emit({ direction: swipe });
          }
        }
      }
    }
  }

}
