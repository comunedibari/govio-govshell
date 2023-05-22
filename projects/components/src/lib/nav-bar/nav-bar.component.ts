import { Component, EventEmitter, OnInit, Output, Input, OnDestroy, ViewChild, HostBinding, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';

import { ActionType, DefaultAction, MatMenuDivider } from './toolbar-actions';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {
  @HostBinding('class.prominent') get prominentClass(): boolean {
    return this.prominent;
  }
  @HostBinding('class.dense') get denseClass(): boolean {
    return !this.prominent && !this.contextual;
  }
  @HostBinding('class.contextual') get contextualClass(): boolean {
    return !this.prominent && this.contextual;
  }

  @Input() prominent: boolean = true;
  @Input() contextual: boolean = false;

  @Input() title: string = '';
  @Input() hamburger: boolean = false;
  @Input() modalMode: boolean = false;
  @Input() isDetail: boolean = false;
  @Input() backMode: boolean = false;
  @Input() hasTab: boolean = false;
  @Input() stepBack: string = '';
  @Input() tabs: any[] = [];

  @Input() toolbarActions: any = DefaultAction();

  @Output() toggleMenuEvt: EventEmitter<any> = new EventEmitter();
  @Output() backMenuEvt: EventEmitter<any> = new EventEmitter();
  @Output() modalMenuEvt: EventEmitter<any> = new EventEmitter();
  @Output() actionEvt: EventEmitter<any> = new EventEmitter();

  ActionType = ActionType;
  MatMenuDivider = MatMenuDivider;

  constructor(public router: Router) {
  }

  ngOnInit() {}

  ngOnDestroy() {
  }

  __onToggleMenu() {
    this.toggleMenuEvt.emit({ type: 'toggleMenu' });
  }

  __onStepBack(isModal: boolean, backMode: boolean) {
    if (backMode) {
      this.backMenuEvt.emit({ type: 'onBackMenu' });
    }
    if (isModal) {
      this.modalMenuEvt.emit({ type: 'onModalMenu' });
    }
  }

  __toolActionClick(icon: string, type: string, action?: any, element?: HTMLElement) {
    const url: string = this.router.url;
    this.actionEvt.emit({ target: url, value: icon, type, action, element });
  }

  __hasValidActions(actions: any[]): boolean {
    return (actions && actions.length !== 0);
  }

  // __twinKeyDown(event: any, ci: any, index: number) {
  //   if (ci.disabled) {
  //     event.preventDefault();
  //     return;
  //   }
  //   if (event && (event.keyCode === 13 || event.code === 'Enter')) {
  //     this.__toolTwinClick(event, ci, index);
  //   }
  // }

  // __toolTwinClick(event: any, ci: any, index: number) {
  //   if (ci.disabled) {
  //     event.preventDefault();
  //     return;
  //   }
  //   this._indexChp = index;
  //   this.__toolActionClick(ci.icon, ActionType.TwinContext, ci);
  // }
}

@Pipe({
  name: 'filterActions'
})
export class FilterActionsPipe implements PipeTransform {
  transform(items: any[], filter: (item: any) => {}): any[] {
    if (!items) {
      return items;
    }
    return items.filter(filter);
  }
}

@Pipe({
  name: 'innerHTML'
})
export class InnerHTMLPipe implements PipeTransform {
  transform(value: any, target: HTMLElement): any[] {
    return target.innerHTML = value;
  }
}
