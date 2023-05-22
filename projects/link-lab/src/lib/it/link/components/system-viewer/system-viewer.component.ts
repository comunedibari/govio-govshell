import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';

@Component({
  selector: 'link-system-viewer',
  template: `
    <div class="container-fluid h-100">
      <div class="row align-items-stretch h-100">
        <div class="col">
          <div class="row browse-container align-items-stretch h-100">
            <div class="browse-element" *ngFor="let col of _startingGrid">
              <div *ngFor="let o of col.columns" [class]="__class(o.level)" (click)="__onItemClick(o)">
                <span class="material-icons">{{ o.type }}</span>
                <p class="m-0 ms-2 pl-1">{{ o.nome }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6 current-browse-element" *ngIf="_currentBrowseElement && preview">
          <ng-content select="[content-viewer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    .browse-container {
      flex-wrap: nowrap;
      overflow-x: auto;
    }
    .current-browse-element {
      padding: 1rem;
      display: none;
    }
    .browse-element {
      padding: 1rem;
      border-right: 1px solid #C5C5C5;
      flex-shrink: 0;
      min-width: 35%;
    }
    .browse-element .element {
      cursor: pointer;
    }
    .browse-element:only-child {
      min-width: 100%;
    }
    .browse-element p {
      font-size: 1rem;
    }
    @media (max-width: 767px) {
      .browse-element:last-child {
        border: none;
      }
    }
    @media (min-width: 576px) {
      :host(.preview) .browse-element {
        min-width: 30%;
        width: 30%;
      }
      :host:not(.preview) .browse-element {
        min-width: 20%;
        width: 20%;
      }
    }
    @media (min-width: 768px) {
      .current-browse-element {
        display: block;
      }
      :host(.preview) .browse-element {
        min-width: 40%;
        width: 40%;
      }
    }
    @media (min-width: 992px) {
      .current-browse-element {
        display: block;
      }
      :host(.preview) .browse-element {
        min-width: 35%;
        width: 35%;
      }
    }
    .parent-active-browse-element {
      color: var(--system-viewer-parent-active-element-color, #000);
    }
    .active-browse-element {
      color: var(--system-viewer-active-element-color, #000);
    }
  `]
})
export class SystemViewerComponent implements OnInit {
  @HostBinding('class.preview') get previewClass(): boolean {
    return this.preview;
  }
  @Input() propertyGroup: string = '';
  @Input() property: string = '';
  @Input() preview: boolean = true;
  @Input() set dataSource(value: any[]) {
    this.__initSystemBrowser(value);
  }

  @Output() itemClickEvt: EventEmitter<any> = new EventEmitter();

  _currentBrowseElement: any;
  _startingGrid: any[] = [];
  _dataSource: any[] = [];

  constructor() { }

  ngOnInit() {
  }

  __initSystemBrowser(list: any[]) {
    this._currentBrowseElement = null;
    this._dataSource = this.__grouping((list || []), this.propertyGroup, this.property);
    this._startingGrid = [ {
      columns: this._dataSource.map((item: any) => {
        const gi: any = { ...item };
        delete gi.children;
        return gi;
      })
    }];
  }

  __grouping(items: any[], property: string, compare: string): any[] {
    if (!property || !compare) {
      return [];
    }
    const structure: any[] = [];
    const mappedList: any = {};
    let mappedElem: any;

    items.forEach((item: any) => {
      if (item[compare]) {
        mappedList[item[compare]] = item;
        mappedList[item[compare]].children = [];
      }
    });

    for (const id of Object.keys(mappedList)) {
      if (mappedList.hasOwnProperty(id)) {
        mappedElem = mappedList[id];
        mappedElem.level = 0;
        if (mappedElem[property]) {
          mappedList[mappedElem[property]].children.push(mappedElem);
          mappedList[mappedElem[property]].type = 'folder';
          mappedElem.type = mappedElem.children.length!==0?'folder':'insert_drive_file';
        }
        else {
          mappedElem.type = mappedElem.children.length!==0?'folder':'insert_drive_file';
          structure.push(mappedElem);
        }
      }
      const __branchLevels = (branches: any[], level: string = '') => {
        branches.forEach((branch: any, bl: number) => {
          branch.level = `${level}${bl}`;
          if (branch.children.length !== 0) {
            __branchLevels(branch.children, branch.level);
          }
        });
      };
      __branchLevels(structure);
    }
    return structure;
  }


  __onItemClick(element: any) {
    let item: any = this._dataSource.slice(0);
    if (this._startingGrid.length > element.level.length) {
      this._startingGrid.splice(element.level.length);
    }
    for (let i = 0; i < element.level.length; i++) {
      item = (i === 0)?item[element.level.charAt(i)]:item.children[element.level.charAt(i)];
    }
    if (item.children.length !== 0) {
      this._startingGrid = this._startingGrid.concat({ columns: item.children });
    }
    this.itemClickEvt.emit({ target: element, first: !!this._currentBrowseElement });
    this._currentBrowseElement = element;
  }

  __class(level: string): any {
    const chunk: string = this._currentBrowseElement?this._currentBrowseElement.level.slice(0, level.length):'*';
    const isParent: boolean = (chunk === level);
    return {
      'd-flex': true,
      'mb-3': true,
      'element': true,
      'parent-active-browse-element': isParent,
      'active-browse-element': (this._currentBrowseElement && this._currentBrowseElement.level === level)
    };
  }

}
