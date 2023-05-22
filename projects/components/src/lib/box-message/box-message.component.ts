import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-box-message',
  templateUrl: './box-message.component.html',
  styleUrls: ['./box-message.component.scss']
})
export class BoxMessageComponent implements OnInit {
  @Input() show: boolean = true;
  @Input() icon: string = 'warning';
  @Input() color: string = 'text-danger';
  @Input() message: string = '';

  constructor() {}

  ngOnInit() {
  }
}
