import { ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CdkAccordion, CdkAccordionItem } from '@angular/cdk/accordion';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { animate, AUTO_STYLE, group, state, style, transition, trigger } from '@angular/animations';
import { EditColor } from '../../classes/definitions';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'link-collapse-item',
  template: `
    <div class="header-box">
      <div #ci class="active-item d-flex flex-grow-1 align-items-center" (touchstart)="__swipe($event, 'start')" (touchend)="__swipe($event, 'end')">
        <div class="pl-3 pr-1 mb-n1" *ngIf="_editMode">
          <mat-checkbox #cb class="edit-selector" [color]="_checkboxColor.toString()" [disabled]="_checkDisabled || __gestureDetect" (change)="__change($event)"></mat-checkbox>
        </div>
        <div class="collapse-item-header">
          <div class="d-flex align-items-center">
            <i class="icon flex-shrink-0 material-icons cursor-pointer" *ngIf="enableCollapse" (click)="__toggle($event, ci)">{{ expanded?'expand_less':'expand_more' }}</i>
            <div class="flex-grow-1 primary-text">
              <p [innerHtml]="_sanitizeHtml(_primaryText)"></p>
            </div>
            <div class="secondary-text" *ngIf="_secondaryText" [style.--collapse-item-secondary-text-background-color]="_secondaryFeedback">
              <p [style.--collapse-item-secondary-text-color]="_secondaryTextColor" [innerHtml]="_sanitizeHtml(_secondaryText)"></p>
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
    <div class="collapse-item-body" role="region" [class.expanded]="expandedChange|async" [@transition]="expanded"
        (@transition.done)="__endTransition($event)" (@transition.start)="__startTransition($event)"
        [attr.aria-labelledby]="'collapse-item-body'">
      <ng-content select="[collapse-content]"></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
      margin-bottom: .5rem;
    }

    :host:only-child,
    :host:last-child {
      margin-bottom: 0;
    }

    :host .header-box {
      position: relative;
      display: flex;
      align-items: center!important;
    }

    :host .active-item {
      display: block;
      position: relative;
      left: 0;
      z-index: 1;
      transition-property: left, background-color;
      transition-duration: .100s;
      background-color: var(--collapse-item-background-color, #fff);
    }

    :host .active-item:hover {
      // background-color: var(--collapse-item-hover, #b0b0b0);
    }

    :host(.no-feedback) .active-item:hover {
      background-color: var(--collapse-item-background-color, #fff);
    }

    :host .active-item.swipe {
      position: relative;
      left: -48px;
      transition: left .100s linear;
      background-color: var(--collapse-item-background-color, #fff);
    }

    :host .collapse-item-header {
      flex-grow: 1;
      margin-bottom: 1px;
    }

    .cursor-pointer {
      cursor: pointer;
    }

    .collapse-item-header .primary-text,
    .collapse-item-header .secondary-text {
      padding-top: .75rem;
      padding-bottom: .75rem;
      min-width: calc(50% - 1.5rem);
      white-space: normal;
    }

    .collapse-item-header .secondary-text {
      padding-left: .75rem;
      padding-right: .75rem;
      background-color: var(--collapse-item-secondary-text-background-color, transparent);
    }

    .collapse-item-header .primary-text {
      padding-left: .75rem;
      padding-right: 0;
    }

    .collapse-item-body {
      background-color: var(--collapse-item-background-color, #fff);
    }

    p {
      font-size: 1rem;
      line-height: 1.5;
      margin: 0;
      word-break: break-all;
    }

    .secondary-text p {
      // font-weight: 600;
      text-align: right;
      color: var(--collapse-item-secondary-text-color, inherit);
      font-size: inherit;
    }

    .icon {
      padding: 0.75rem 0 0.75rem 0;
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

    .collapse-item-body {
      display: none;
    }

    :host(.transition) .collapse-item-body {
      display: block;
    }
  `],
  animations: [
    trigger('transition', [
      state('false', style({ height: '0', opacity: 0 })),
      state('true', style({ height: AUTO_STYLE, opacity: 1 })),
      transition('false => true', [
        group([
          animate( '.250s .15s linear', style({ opacity: 1 })),
          animate( '.250s linear', style({ height: AUTO_STYLE }))
        ])
      ]),
      transition('true => false', [
        group([
          animate( '.250s linear', style({ opacity: 0 })),
          animate( '.250s .15s linear', style({ height: 0 }))
        ])
      ])
    ])
  ]
})
export class CollapseItemComponent extends CdkAccordionItem implements OnInit {
  get show(): boolean {
    return this._show;
  }
  @Input('show') set show(value: boolean) {
    this._show = value;
    this.expanded = value;
  }
  @HostBinding('class.no-feedback') get noFeedbackClass(): boolean {
    return !this.hoverFeedback;
  }
  @HostBinding('class.transition') get transitionState(): boolean {
    return this._transition;
  }
  @ViewChild('cb') _selector!: MatCheckbox;

  private _show: boolean = false;
  private _transition: boolean = false;
  @Input('primaryText') _primaryText: string = '';
  @Input('secondaryText') _secondaryText: string = '';
  @Input('secondaryFeedback') _secondaryFeedback: string = 'transparent';
  @Input('secondaryTextColor') _secondaryTextColor: string = 'inherit';
  @Input('action') _action: string = '';
  @Input('checkDisabled') _checkDisabled: boolean = false;
  @Input('editMode') _editMode: boolean = false;
  @Input('actionBackgroundColor') _actionBackgroundColor: string = '';
  @Input('actionHoverColor') _actionHoverColor: string = '';
  @Input('checkboxColor') _checkboxColor!: EditColor;
  @Input() actionDisabled: boolean = false;
  @Input() enableCollapse: boolean = false;
  @Input() hoverFeedback: boolean = true;

  @Output() editSelection: EventEmitter<any> = new EventEmitter();
  @Output() simpleActionClick: EventEmitter<any> = new EventEmitter();
  @Output() swipeEvent: EventEmitter<any> = new EventEmitter();

  __ripple: string = 'rgba(0,0,0,.05)';
  __hasGesture: boolean = false;
  __gestureDetect: boolean = false;
  __swipeCoord!: [ number, number ];
  __swipeTime!: number;

  constructor(@Optional() accordion: CdkAccordion, _changeDetectorRef: ChangeDetectorRef, _expansionDispatcher: UniqueSelectionDispatcher, private sanitized: DomSanitizer) {
    super(accordion, _changeDetectorRef, _expansionDispatcher);
  }

  ngOnInit() {
    this.__hasGesture = this.__hasTouchEvent();
  }

  __toggle(event: any, activeItem: any) {
    if (this.enableCollapse && !this.__gestureDetect) {
      this.toggle();
    } else {
      event.stopImmediatePropagation();
      event.preventDefault();
      this.__gestureDetect = false;
      if (activeItem.classList.contains('swipe')) {
        activeItem.classList.remove('swipe');
      }
    }
  }

  _sanitizeHtml(html: string) {
    return this.sanitized.bypassSecurityTrustHtml(html)
  }

  __change(event: any) {
    this.editSelection.emit({ selected: event.checked });
  }

  __hasTouchEvent(): boolean {
    return 'ontouchstart' in document.documentElement;
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

  __startTransition(event: any) {
    if (!event.fromState && event.toState) {
      this._transition = true;
    }
  }

  __endTransition(event: any) {
    if (event.fromState && !event.toState) {
      this._transition = false;
    }
  }

  public getItemSelection(): boolean {
    if (this._selector) {
      return this._selector.checked;
    }

    return false;
  }
}
