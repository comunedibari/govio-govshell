import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-yesno-dialog',
  templateUrl: './yesno-dialog.component.html',
  styleUrls: ['./yesno-dialog.component.scss']
})
export class YesnoDialogComponent implements OnInit {

  dialogData: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialogRef<YesnoDialogComponent>) {
    this.dialogData = data;
  }

  ngOnInit() {
  }

  _closeDialog(procedi: boolean) {
    this.dialog.close({ type: 'YesnoDialogComponent', response: procedi });
  }

}
