import { Component, OnInit } from '@angular/core';
import { Tools } from 'projects/tools/src/lib/tools.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  _rescueCall() {
    if(Tools.EmergencyCall && Tools.EmergencyCall.length !== 0) {
      Tools.EmergencyCall.forEach((ec: Subscription) => ec.unsubscribe());
      Tools.EmergencyCall = [];
    }
    Tools.WaitForResponse(false, true);
  }
}
