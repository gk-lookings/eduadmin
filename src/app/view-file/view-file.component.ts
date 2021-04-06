import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DashboardComponent } from '../dashboard/dashboard.component';
@Component({
  selector: 'app-view-file',
  templateUrl: './view-file.component.html',
  styleUrls: ['./view-file.component.css']
})
export class ViewFileComponent implements OnInit {
  isImage = false
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef : MatDialogRef<ViewFileComponent>) { }

  ngOnInit() {
    if(this.data.type.includes("image"))
    this.isImage = true
    
  }


}
