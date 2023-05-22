import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EditColor } from '../../classes/definitions';

@Component({
  selector: 'link-simple-item',
  template: `
    <div class="d-flex align-items-center">
      <div #si class="active-item d-flex flex-grow-1 align-items-center" (touchstart)="__swipe($event, 'start')" (touchend)="__swipe($event, 'end')">
        <div class="pl-3 pr-1 mb-n1" *ngIf="_editMode">
          <mat-checkbox class="edit-selector" [color]="_checkboxColor.toString()" [disabled]="_checkDisabled || __gestureDetect" (change)="__change($event)"></mat-checkbox>
        </div>
        <div class="d-flex align-items-center w-100 main-content">
          <div class="flex-grow-1">
            <div class="d-block main-data">
              <div class="flex-grow-1- primary-text pb-0">
                <span class="fw-bold-600 text-hover cursor-pointer" [innerHtml]="_sanitizeHtml(_primaryText)" (click)="__simpleClick($event, si)"></span>
              </div>
            </div>
            <div class="d-block meta-data" *ngIf="_metadata">
              <p *ngIf="!keepTextFormat" [innerHtml]="_sanitizeHtml(_metadata)"></p>
              <pre *ngIf="keepTextFormat" class="m-0" [innerHtml]="_sanitizeHtml(_metadata)"></pre>
            </div>
          </div>
          <div class="secondary-text text-end ps-3" *ngIf="_secondaryText" [style.--simple-item-secondary-text-background-color]="_secondaryFeedback">
            <div class="d-block" *ngIf="_secondaryText" [style.--simple-item-secondary-text-background-color]="_secondaryFeedback">
              <span class="d-block" [style.--simple-item-secondary-text-color]="_secondaryTextColor" [innerHtml]="_sanitizeHtml(_secondaryText)"></span>
            </div>
            <div class="d-block meta-data" *ngIf="_secondaryMetadata">
              <p class="d-block" [innerHtml]="_sanitizeHtml(_secondaryMetadata)"></p>
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
      background-color: var(--simple-item-background-color, #fff);
      margin-bottom: .5rem;
    }

    :host:only-child,
    :host:last-child {
      margin-bottom: 0;
    }

    :host:hover {
      // background-color: var(--simple-item-hover, #b0b0b0);
    }

    :host(.notify) .active-item:before {
      position: absolute;
      content: 'new_releases';
      font-family: 'Material Icons';
      width: 24px;
      height: 24px;
      line-height: 1;
      font-size: 1.5rem;
      color: var(--simple-item-notify-color, #ef9a9a);
      z-index: 2;
      left: -12px;
      top: calc(50% - 12px);
    }

    :host(.no-feedback):hover {
      background-color: var(--simple-item-background-color, #fff);
    }

    .cursor-pointer {
      cursor: pointer;
    }

    .fw-bold-600 {
      font-weight: 600;
    }

    .text-hover {
      &:hover {
        color: var(--link-hover-color, #111);
      }
    }

    .main-content {
      padding: 10px 16px;
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
      background-color: var(--simple-item-background-color, #fff);
    }

    .main-data .primary-text,
    .main-data .secondary-text {
      padding-bottom: .35rem;
      min-width: calc(50% - 1.5rem);
      white-space: normal;
    }

    .main-data .secondary-text {
      padding-left: .75rem;
      // padding-right: .75rem;
      background-color: var(--simple-item-secondary-text-background-color, transparent);
    }

    .main-data .primary-text {
      // padding-left: .75rem;
      padding-right: .75rem;
    }

    .meta-data {
      // padding: 0 0 0.6rem;
    }

    p {
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0;
      word-break: break-all;
    }

    pre {
      white-space: pre-line;
    }

    .secondary-text p {
      // font-weight: 600;
      text-align: right;
      color: var(--simple-item-secondary-text-color, inherit);
    }

    .meta-data p,
    .meta-data pre {
      color: var(--simple-item-metadata-color, #333);
    }

    .action {
      padding: 0 .75rem;
      background-color: var(--simple-item-action-background-color, #fff);
    }

    .action i {
      color: var(--simple-item-action-color, #000);
    }

    .action:hover {
      background-color: var(--simple-item-hover-action-background-color, #333);
    }

    .action:hover i {
      color: var(--simple-item-hover-action-color, #000);
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
export class SimpleItemComponent implements OnInit {
  @HostBinding('class.notify') get notifyClass(): boolean {
    return this.notify;
  }
  @HostBinding('class.no-feedback') get noFeedbackClass(): boolean {
    return !this.hoverFeedback || this.__gestureDetect;
  }

  @Input('primaryText') _primaryText: string = '';
  @Input('secondaryText') _secondaryText: string = '';
  @Input('metadata') _metadata: string = '';
  @Input('secondaryMetadata') _secondaryMetadata: string = '';
  @Input('action') _action: string = '';
  @Input('checkDisabled') _checkDisabled: boolean = false;
  @Input('editMode') _editMode: boolean = false;
  @Input('secondaryFeedback') _secondaryFeedback: string = 'transparent';
  @Input('secondaryTextColor') _secondaryTextColor: string = 'inherit';
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

  constructor(private sanitized: DomSanitizer) { }

  ngOnInit() {
    this.__hasGesture = this.__hasTouchEvent();
  }

  _sanitizeHtml(html: string) {
    return this.sanitized.bypassSecurityTrustHtml(html)
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
