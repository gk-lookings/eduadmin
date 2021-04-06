import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { DashboardComponent } from '../dashboard/dashboard.component';
@Component({
  selector: 'app-confirm-delete-model',
  templateUrl: './confirm-delete-model.component.html',
  styleUrls: ['./confirm-delete-model.component.css']
})
export class ConfirmDeleteModelComponent implements OnInit {

  constructor(public dialog : MatDialogRef<ConfirmDeleteModelComponent>) { }

  ngOnInit() {
  }
  close(){
    this.dialog.close();
  }
  submit()
  {
    this.dialog.close(true)
  }

}
