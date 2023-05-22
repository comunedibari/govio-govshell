import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

import { Tools } from 'projects/tools/src/lib/tools.service';

@Component({
  selector: 'flex-table',
  template: `
    <div class="table-container" role="table" aria-label="Data" *ngIf="_data.length !== 0">
      <div class="flex-table header" [class.sticky-top]="_sticky" [ngStyle]="_gridStyle" role="rowgroup">
        <div role="columnheader" *ngFor="let col of _columns; let first = first;"
          class="flex-row {{ col.class }}" [class.first]="first">
          {{ col.label | translate }}
        </div>
      </div>
      <div class="flex-table table-row" [ngStyle]="_gridStyle" role="rowgroup" *ngFor="let item of _data" (click)="_rowClick(item)">
        <div role="cell" *ngFor="let col of _columns; let first = first;"
          class="flex-row {{ col.class }}" [class.first]="first">
          <span [innerHTML]="Tools.formatValue(Tools.getObjectValue(item.source, col.field), col)"></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
    }

    .table-container {
      display: block;
      margin: 0em auto;
      width: 100%;
      max-width: 100%;
    }

    .flex-table {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      grid-template-rows: 100% auto;
      transition: .5s;

      &.header {
        &.sticky-top {
          background-color: rgb(235, 235, 235);
        }
      }

      &:first-of-type {
        font-size: 1rem;
        text-align: left;
        text-transform: uppercase;
        color: var(--table-header-color, #000);
        background-color: var(--table-header-background-color, #fff);
        margin-bottom: .5rem;
      }

      .flex-row {
        font-size: .8rem;
        word-break: break-word;
        padding: .75rem;
      }

      &:first-of-type .flex-row {
        font-size: 1rem;
        // background-color: var(--table-row-background-color, #fff);
        display: flex;
        // justify-content: center;
        align-items: center;
      }

      &.table-row:nth-child(odd) .flex-row {
        // background-color: var(--table-row-background-color, #fff);
      }

      &.table-row:nth-child(even) .flex-row {
        // background-color: var(--table-row-background-color, #fff);
      }

      &:hover {
        // background-color: var(--table-row-hover, #bbb);
        // transition: 500ms;
      }

      &.table-row {
        background-color: var(--table-row-background-color, #fff);

        &:hover {
          background-color: var(--table-row-hover, #bbb);
          transition: 500ms;
        }
      }
    }

    .flex-row {
      display: block;
      width: 100%;
      // text-align: center;
    }

    .rowspan {
      display: grid;
      grid-template-columns: 25% 75%;
      grid-template-rows: 100%;
    }

    .column {
      width: 100%;
      padding: 0;

      .flex-row {
        display: grid;
        grid-template-columns: repeat(auto-fill, 33.3%);
        grid-template-rows: 100% 100% 100%;
        width: 100%;
        padding: 0;
        border: 0;

        &:hover {
          background-color: var(--table-row-hover, #bbb);
          transition: 500ms;
        }
      }
    }

    .flex-cell {
      text-align: center;
      padding: .5em;
      // border-right: solid 1px $table-border;
    }
  `]
})
export class CardComponent implements OnInit {
  @Input('columns') _columns: any[] = [];
  @Input('data') _data: any[] = [];
  @Input('gridStyle') _gridStyle: any = {};
  @Input('sticky') _sticky: boolean = false;
  // [paginator]="true" [sortable]="true" [sort]="_sort" [filterable]="true" [filter]="_filter" [selection]="_selection" [selectionMode]="'multiple'"

  @Output() rowClick: EventEmitter<any> = new EventEmitter();

  Tools = Tools;

  _colPerc: number = 10;

  constructor() { }

  ngOnInit() {
    this._colPerc = 100 / this._columns.length;
  }

  _rowClick(event: any) {
    this.rowClick.emit(event);
  }
}
