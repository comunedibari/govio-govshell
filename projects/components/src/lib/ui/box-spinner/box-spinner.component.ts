import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Tools } from 'projects/tools/src/lib/tools.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:component-selector
  selector: 'ui-box-spinner',
  template: `
    <div class="d-flex flex-column text-center mt-3">
      <div class="max-w-100 m-auto">
        <div class="mx-auto my-0 p-3 position-relative">
          <mat-progress-spinner [color]="color" mode="indeterminate" [diameter]="diameter" [strokeWidth]="strokeWidth"></mat-progress-spinner>
          <!-- <span class="rescue-spinner">
            <button mat-button mat-icon-button type="button" (click)="_rescueCall()">
              <mat-icon fontSet="material-icons-outlined">close</mat-icon>
            </button>
          </span> -->
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rescue-spinner {
      position: absolute;
      top: calc(50% - 20px);
      left: calc(50% - 20px);
      width: 40px;
      height: 40px;

      .mat-icon {
        vertical-align: inherit;
      }
    }

    .rescue-spinner button {
      display: none;
      color: #212121;
    }

    .rescue-spinner:hover button {
      display: block;
    }
  `]
})
export class BoxSpinnerComponent implements OnInit {
  @Input() color = 'accent';
  @Input() diameter = 36;
  @Input() strokeWidth = 4;

  constructor() { }

  ngOnInit() {
  }

  _rescueCall() {
    if (Tools.EmergencyCall && Tools.EmergencyCall.length !== 0) {
      Tools.EmergencyCall.forEach((ec: Subscription) => ec.unsubscribe());
      Tools.EmergencyCall = [];
    }
    Tools.WaitForResponse(false, true);
  }
}
