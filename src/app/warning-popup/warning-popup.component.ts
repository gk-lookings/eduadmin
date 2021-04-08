import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-warning-popup',
  templateUrl: './warning-popup.component.html',
  styleUrls: ['./warning-popup.component.css']
})
export class WarningPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog : MatDialogRef<WarningPopupComponent>) { }

  ngOnInit() {
  }
  

}
