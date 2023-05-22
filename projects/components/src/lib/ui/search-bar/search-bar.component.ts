import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ui-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: [
    // './search-bar.component.scss'
    // './_search-bar.component.scss'
    // './search-bar-1.component.scss',
    // './search-bar-2.component.scss'
  ]
})
export class SearchBarComponent implements OnInit {
  @Input() showHistory: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() searchFields: any[] = [];
  @Input() showSorting: boolean = true;
  @Input() showDataRange: boolean = false;
  @Input() sortField: string = '';
  @Input() sortDirection: string = 'asc';
  @Input() sortFields: any[] = [];
  @Input() classBlock: string = '';
  @Input() placeholder: string = 'Search or filter results...';

  @Output() onSort: EventEmitter<any> = new EventEmitter();

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    // this._addIconsSvg();
  }

  ngOnInit() {
  }

  _addIconsSvg() {
    const _svgIcons = [
      { label: 'sort_ascending', icon: 'sort_ascending.svg' },
      { label: 'sort_descending', icon: 'sort_descending.svg' }
    ];
    _svgIcons.forEach(item => {
      this.matIconRegistry.addSvgIcon(
        item.label,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`./assets/images/icons/${item.icon}`)
      );
    });
  }

  _selectSort(item: any) {
    this.sortField = item.field;
    this.onSort.emit({ sortField: this.sortField, sortBy: this.sortDirection });
  }

  _toggleSortBy() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.onSort.emit({ sortField: this.sortField, sortBy: this.sortDirection });
  }

  _isAscending() {
    return this.sortDirection === 'asc';
  }

  _getSortLabel(field: string) {
    return this.sortFields.find(item => item.field === field).label;
  }

  _clearSearch() {
    // Clear array of search fields
  }
}
