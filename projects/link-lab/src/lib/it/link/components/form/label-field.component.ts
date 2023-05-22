import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FieldClass, FieldLinksClass } from '../../classes/definitions';
import { FieldType } from '../../classes/definitions';

@Component({
  selector: 'link-field',
  template: `
    <div class="row">
      <ng-template [ngIf]="!_field && _fields">
        <p class="col-4 field-label">{{ _fields.label }}</p>
        <div class="col-8">
          <div class="d-flex align-items-start field-value" *ngFor="let f of _fields.sublinks">
            <button mat-icon-button type="button" *ngIf="(f.link || f.data) && f.icon" (click)="__downloadClick(f)">
              <mat-icon fontSet="material-icons-outlined">{{ f.icon }}</mat-icon>
            </button>
            <p *ngIf="f.value" class="field-text">{{ f.value }}</p>
          </div>
        </div>
      </ng-template>
      <ng-template [ngIf]="_field && !_fields">
        <p class="col-4 field-label">{{ _field.label }}</p>
        <div class="col-8">
          <div class="d-flex align-items-start field-value">
            <button mat-icon-button type="button" *ngIf="_field.type !== FieldType.Image && _field.download && _field.icon"
                    (click)="__downloadClick(_field)"><mat-icon fontSet="material-icons-outlined">{{ _field.icon }}</mat-icon></button>
            <img *ngIf="_field.type === FieldType.Image" [src]="_field.value">
            <p class="flex-grow-1" *ngIf="_field.type !== FieldType.Image">
              <span *ngIf="_field.value && _field.type === FieldType.Text" class="field-text">{{ _field.value }}</span>
              <span *ngIf="_field.link && _field.type === FieldType.Email" class="field-mail"><a [href]="_field.link" target="_self">{{ _field.value || _field.link }}</a></span>
              <span *ngIf="_field.link && _field.type === FieldType.Link" class="field-link"><a [href]="_field.link" target="_blank">{{ _field.value || _field.link }}</a></span>
              <span *ngIf="_field.value && _field.type === FieldType.Route" class="field-route"><a href="javascript:void(0)" (click)="__routeEvent($event, _field)">{{ _field.value }}</a></span>
            </p>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
      margin-bottom: 1rem;
    }

    :host:last-of-type {
      margin-bottom: 0;
    }

    .field-label {
      line-height: 1.5;
      text-align: right;
      word-break: break-word;
      margin: 0;
      color: var(--link-field-label-color, #b0b0b0);
    }

    .field-value p {
      text-align: left;
      line-height: 1.5;
      word-break: break-word;
      margin: 0;
    }

    .field-value a {
      line-height: 1.5;
    }

    .field-value img {
      width: 100px;
      height: auto;
      margin: 0;
    }

    .field-value:not(:last-child):not(:only-child) {
      margin-bottom: 1rem;
    }

    .field-text,
    .field-value > button {
      color: var(--link-field-color, #000);
    }

    .field-value > button {
      margin: -.25rem 0 0 -.7rem;
    }

    .field-mail,
    .field-link,
    .field-route {
      color: var(--link-field-permalink-color, #0091ea);
    }
  `]
})
export class LabelFieldComponent implements OnInit {

  @Input('field') _field!: FieldClass;
  @Input('fields') _fields!: FieldLinksClass;

  @Output() routeClick: EventEmitter<any> = new EventEmitter();
  @Output() downloadClick: EventEmitter<any> = new EventEmitter();

  public FieldType = FieldType;

  constructor() { }

  ngOnInit() {}

  __routeEvent(event: any, target: FieldClass) {
    this.routeClick.emit({ view: event.view, target });
  }

  __downloadClick(item: any) {
    this.downloadClick.emit({ item });
  }
}
