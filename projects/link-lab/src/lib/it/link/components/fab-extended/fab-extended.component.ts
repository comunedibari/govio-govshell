import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'link-fab-extended',
  template: `
    <button mat-flat-button class="fab-extended" color="accent" [type]="type" *ngIf="valid"
            (click)="_onSubmit($event)">
      <mat-icon fontSet="material-icons-outlined">{{submitIcon}}</mat-icon>
      <span class="ms-2">{{submitLabel}}</span>
    </button>
  `,
  styles: [`
    .fab-extended {
      background: var(--fab-extended-background, #000);
      color:  var(--fab-extended-color, #fff);
      border-radius: 1.75rem;
      line-height: 100%;
    }
  `]
})
export class FabExtendedComponent implements OnInit {

  @Input() valid: boolean = true;
  @Input() type: string = 'button';
  @Input() submitIcon: string = '';
  @Input() submitLabel: string = '';
  @Output() submit: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  _onSubmit(event: any) {
    this.submit.emit(event);
  }

}
