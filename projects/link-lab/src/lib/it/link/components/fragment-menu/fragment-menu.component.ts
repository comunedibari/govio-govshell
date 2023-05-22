import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FragmentClass } from '../../classes/definitions';

@Component({
  selector: 'link-fragment-menu',
  template: `
    <div class="fragment-item" *ngFor="let fi of _data; let i = index">
      <a #fragment class="fragment" href="javascript:void(0)" [attr.data-fragment]="fi.fragment"
         [attr.data-index]="i">{{ fi.label }}</a>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .fragment-item {
      line-height: 1.7;
    }
    a.fragment {
      display: inline-block;
    }
    .fragment-item > a.fragment {
      border: none;
      border-left: solid 2px var(--anchor-fragment-color, #000);
    }
    .fragment-item > a.fragment.active-fragment,
    .fragment-item > a.fragment:hover {
      border: none;
      border-left: solid 2px var(--anchor-fragment-active-color, #000);
    }
    a.fragment,
    a.fragment:active {
      min-height: 3rem;
      padding: .75rem;
      text-decoration: none;
      text-overflow: ellipsis;
      overflow: hidden;
      color: var(--anchor-fragment-color, #000);
      background-color: var(--anchor-fragment-background-color, transparent);
    }
    a.fragment.active-fragment,
    a.fragment:hover {
      min-height: 3rem;
      padding: .75rem;
      text-decoration: none;
      text-overflow: ellipsis;
      overflow: hidden;
      color: var(--anchor-fragment-active-color, #000);
      background-color: var(--anchor-fragment-active-background-color, transparent);
    }
  `]
})
export class FragmentMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('fragment') _fragments!: QueryList<any>;

  @Input() scroller!: string;
  @Input() timeScrolling: number = 1000;
  @Input() set list(value: FragmentClass[]) {
    this._data = value;
  }
  get list(): FragmentClass[] {
    return this._data;
  }
  @Output() fragmentClick: EventEmitter<any> = new EventEmitter();

  _data: FragmentClass[] = [];
  _scrollerEvt: string = (/Firefox/i.test(navigator.userAgent))? 'DOMMouseScroll' : 'mousewheel';
  _scroller: any;

  constructor() { }

  ngOnInit() { }

  ngOnDestroy() {
    if (this._scroller) {
      this._scroller.removeEventListener(this._scrollerEvt, this.update.bind(this));
    } else {
      this.__throwError();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this._scroller = document.querySelector('#'+this.scroller);
      if (this._scroller) {
        this._scroller.addEventListener(this._scrollerEvt, this.update.bind(this));
      } else {
        this.__throwError();
      }
      (this._fragments || []).forEach((fr: any) => {
        fr.nativeElement.removeEventListener('click', this.__click.bind(this));
        fr.nativeElement.addEventListener('click', this.__click.bind(this));
      });
      this.update.bind(this);
    });
  }

  __click(event: any) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const dataset: any = event.currentTarget.dataset;
    if (dataset && dataset.fragment && dataset.index) {
      const ft: any = document.querySelector('#'+dataset.fragment);
      this.__scrollTo(ft.offsetTop);
      this.fragmentClick.emit({ target: dataset.fragment, index: dataset.index });
    }
  }

  __easeInOutQuad(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) {
      return c / 2 * t * t + b;
    }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  __scrollTo(to: number) {
    const start = this._scroller.scrollTop;
    const change = to - start;
    let currentTime = 0;
    const increment = 20;

    const animateScroll = () => {
      const duration: number = (this.timeScrolling || 800);
      currentTime += increment;
      this._scroller.scrollTop = this.__easeInOutQuad(currentTime, start, change, duration);
      if(currentTime < duration) {
        setTimeout(animateScroll, increment);
      } else {
        this.update();
      }
    };
    animateScroll();
  }

  __throwError() {
    throw new Error(`Scroller not detected, set a property for [scroller]="'scrollerID'"`);
  }

  update() {
    if (this._fragments && this._fragments.length !== 0) {
      const _fragmentsOffset: any[] = (this._fragments || []).map((fr: any, index: number) => {
        const ft: any = document.querySelector('#'+this.scroller+' #'+fr.nativeElement.dataset.fragment);
        return {
          index,
          next: ((index + 1) > (this._fragments.length - 1))?index:(index + 1),
          offset: ft?ft.offsetTop:0,
          fragment: fr.nativeElement.dataset.fragment
        };
      });
      const _scrollMax: number = Math.abs(this._scroller.scrollHeight - this._scroller.clientHeight);
      const pos: number = this._scroller.scrollTop;
      _fragmentsOffset.forEach((fr: any, index: number) => {
        this._fragments.get(fr.index).nativeElement.classList.remove('active-fragment');
        const nextOffset: number = _fragmentsOffset[fr.next].offset;
        if ((pos >= fr.offset && pos < Math.min(_scrollMax, nextOffset)) ||
          (index === (_fragmentsOffset.length - 1) && ((pos >= fr.offset && pos <= Math.max(_scrollMax, nextOffset)) || pos === _scrollMax))) {
          this._fragments.get(fr.index).nativeElement.classList.add('active-fragment');
        }
      });
    }
  }
}
