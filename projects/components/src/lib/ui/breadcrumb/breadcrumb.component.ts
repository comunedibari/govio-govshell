import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { EventType } from 'projects/tools/src/lib/classes/events';
import { EventsManagerService } from 'projects/tools/src/lib/eventsmanager.service';

import { Breadcrumb, BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'ui-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  @Input() breadcrumbs: any[] = [];
  @Input() classContainer: string = '';

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(
    private eventsManagerService: EventsManagerService,
    private readonly breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
  }

  _onClick(item: Breadcrumb) {
    if (item.url) {
      this.onClick.emit(item);
    }
  }

  _onOpenSidebar() {
    this.eventsManagerService.broadcast(EventType.NAVBAR_OPEN, { value: EventType.NAVBAR_OPEN });
  }
}
