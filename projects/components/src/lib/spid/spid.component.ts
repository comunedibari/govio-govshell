import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-spid',
  templateUrl: './spid.component.html',
  styleUrls: ['./spid.component.scss']
})
export class SpidComponent {

  @Input() spid: string = 'Accedi con SPID';
  @Output() spidSubmit: EventEmitter<any> = new EventEmitter();

  constructor() { }

  _onSubmit() {
    this.spidSubmit.emit();
  }

}

