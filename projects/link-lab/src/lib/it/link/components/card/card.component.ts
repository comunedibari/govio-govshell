import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { EditColor } from '../../classes/definitions';

export enum CardType {
  Simple = 'Simple',
  Extended = 'Extended'
}

@Component({
  selector: 'link-card',
  template: `
    <ng-template [ngIf]="_type === CardType.Extended">
      <div class="e-card d-flex flex-column justify-content-between">
        <div class="top">
          <img [src]="_image" *ngIf="_image" alt="logo">
          <h1 *ngIf="_primaryText" [attr.title]="_primaryText">{{ _primaryText }}</h1>
          <h2 *ngIf="_secondaryText">{{ _secondaryText }}</h2>
          <p *ngIf="_metadata">{{ _metadata }}</p>
        </div>
        <div class="bottom">
          <div class="read-more d-flex align-items-center" (click)="__simpleClick($event)">
            <i class="material-icons">explore</i>
            <p>{{ _readMore }}</p>
          </div>
        </div>
      </div>
    </ng-template>
    <ng-template [ngIf]="_type === CardType.Simple">
      <div class="card-image" [style.background-image]="_image?'url('+_image+')':null" *ngIf="_image || !_collapsed"></div>
      <div class="primary-text" [style.padding-top]="(!_image && _editMode)?'3rem':''">
        <p>{{ _primaryText }}</p>
      </div>
    </ng-template>
    <div class="edit-mode" *ngIf="_editMode">
      <mat-checkbox class="edit-selector" [color]="_editColor.toString()" [disabled]="_checkDisabled" (change)="__change($event)"></mat-checkbox>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
    }

    :host:hover .e-card,
    :host:hover .primary-text {
      background-color: var(--card-hover-background-color, #b0b0b0);
    }

    .card-image {
      position: relative;
      width: 100%;
      background: no-repeat center center;
      background-size: cover;
      padding-top: 56.25%;
      background-color: var(--card-background-color, #fff);
    }

    .edit-mode {
      position: absolute;
      top: 0;
      right: 0;
      width: 40px;
      height: 40px;
      padding: 1rem;
      line-height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
    }

    .edit-mode mat-checkbox {
      height: 20px;
    }

    .primary-text {
      background-color: var(--card-background-color, #fff);
      padding: .75rem;
    }

    .primary-text p {
      margin: 0;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    /* Extended Card */
    :host:hover .e-card .bottom > .read-more > i,
    :host:hover .e-card .bottom > .read-more > p {
      color: var(--e-card-link-hover-color, #b0b0b0);
    }

    .e-card {
      height: 100%;
      padding: 0.75rem;
      overflow: hidden;
      background-color: var(--card-background-color, #fff);
    }

    .e-card ~ .edit-mode {
      background-color: var(--card-background-color, #fff);
    }

    .e-card .bottom,
    .e-card .bottom {
      display: inline-block;
    }

    .e-card .top > img {
      display: block;
      width: 100%;
      height: auto;
      margin: 0 0 1.5rem 0;
    }

    .e-card .top > h1 {
      font-size: 1.5rem;
      font-weight: 600;
      line-height: 1.25;
      margin: 0 0 .5rem 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .e-card .top > h2 {
      font-size: 1rem;
      line-height: 1.5;
      text-transform: uppercase;
      color: var(--e-card-secondary-text-color, rgba(0,0,0,.5));
      margin: 0 0 1rem 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .e-card .top > p {
      font-size: 1rem;
      line-height: 1.5;
      margin: 0 0 2rem 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .e-card .bottom > .read-more {
      cursor: pointer;
      white-space: nowrap !important;
      overflow: hidden;
    }

    .e-card .bottom > .read-more > p {
      font-size: 1rem;
      margin: 0;
      padding: 0 0 0 .625rem;
    }
  `]
})
export class CardComponent implements OnInit {
  @HostListener('click', ['$event']) onClick(event: any) {
    if (this._type === CardType.Simple) {
      this.__simpleClick(event);
    }
  }
  @Input('type') _type: CardType = CardType.Simple;
  @Input('image') _image: string = '';
  @Input('primaryText') _primaryText: string = '';
  @Input('secondaryText') _secondaryText: string = '';
  @Input('metadata') _metadata: string = '';
  @Input('readMore') _readMore: string = 'Leggi tutto';
  @Input('collapsed') _collapsed: boolean = true;
  @Input('checkDisabled') _checkDisabled: boolean = false;
  @Input('editMode') _editMode: boolean = false;
  @Input('editColor') _editColor!: EditColor;

  @Output() editSelection: EventEmitter<any> = new EventEmitter();
  @Output() simpleClick: EventEmitter<any> = new EventEmitter();

  CardType = CardType;

  constructor() { }

  ngOnInit() {}

  __change(event: any) {
    this.editSelection.emit({ selected: event.checked });
  }

  __simpleClick(event: any) {
    if (!this._editMode) {
      this.simpleClick.emit(event);
    }
  }

}
