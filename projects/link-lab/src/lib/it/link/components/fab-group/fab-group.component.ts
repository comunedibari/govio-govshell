import { AfterContentChecked, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'link-fab-group',
  template: `
    <div #mfg class="mini-fabs-group">
      <ng-content select="[fab-content]"></ng-content>
    </div>
    <button mat-fab class="fab-group" type="button" (click)="__toggleExpand()"
            [disabled]="disabled" *ngIf="__hasContent">
      <i class="fab-group-icon material-icons">more_vert</i>
    </button>
  `,
  styles: [`
    .fab-group {
      background-color: var(--fab-group-color, #000);
    }

    .fab-group-icon {
      color: var(--fab-group-icon-color, #fff);
    }

    .mini-fabs-group {
      position: absolute;
      display: block;
      width: 56px;
      opacity: 0;
      bottom: 0;
      text-align: center;
      transition: all .250s;
    }

    .open {
      bottom: 56px;
      opacity: 1;
      transition: all .250s;
    }

    .mini-fabs-group.open > .fab-content {
      margin-bottom: 1rem;
    }

    button {
      box-shadow: none !important;
    }
  `]
})
export class FabGroupComponent implements AfterContentChecked {

  @ViewChild('mfg', { static: false }) _mfg!: ElementRef;

  @HostListener('document:click', ['$event.target']) onClick(targetElement: any) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.close();
    }
  }

  @Input() color: string = '';
  @Input() disabled: boolean = false;

  __hasContent!: boolean;

  constructor(private _elementRef: ElementRef) { }

  ngAfterContentChecked() {
    if (this._mfg) {
      if (this._mfg.nativeElement) {
        this.__hasContent = FabGroupComponent.ContentHasChildren(this._mfg);
      }
    }
  }

  __toggleExpand() {
    if (this._mfg.nativeElement.classList.contains('open')) {
      this.close();
    } else {
      this._mfg.nativeElement.classList.add('open');
      const children: any[] = this._mfg.nativeElement.children || [];
      for (const child of children) {
        if (child.hasAttribute('fab-content')) {
          child.style.marginBottom = '1rem';
        }
      }
    }
  }

  public close() {
    if (this._mfg && this._mfg.nativeElement) {
      this._mfg.nativeElement.classList.remove('open');
    }
  }

  static ContentHasChildren(elRef: ElementRef): boolean {
    return (elRef.nativeElement.children && elRef.nativeElement.children.length !== 0);
  }
}
