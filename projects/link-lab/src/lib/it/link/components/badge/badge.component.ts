import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'link-badge',
  template: `
    <div class="d-flex align-items-center">
      <i class="material-icons">{{_icon }}</i>
      <p class="m-0 pl-2">{{ _text }}</p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
      padding: .75rem;
      color: var(--badge-color, #000);
      background-color: var(--badge-background-color, #fff);
    }
    :host.active {
      color: var(--badge-active-color, #000);
      background-color: var(--badge-background-active-color, #fff);
    }

    p {
      font-size: 1rem;
      line-height: 1.5;
      margin: 0;
      word-break: break-all;
    }
  `]
})
export class BadgeComponent implements OnInit {
  @HostBinding('class.active') get activeClass(): boolean {
    return this._active;
  }
  @Input('text') _text: string = '';
  @Input('icon') _icon: string = '';
  @Input('active') _active: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

}
