import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-publish-model',
  templateUrl: './confirm-publish-model.component.html',
  styleUrls: ['./confirm-publish-model.component.css']
})
export class ConfirmPublishModelComponent implements OnInit {

  constructor(public dialog : MatDialogRef<ConfirmPublishModelComponent>) { }

  ngOnInit() {
  }
  close(){
    this.dialog.close(false);
  }
  submit()
  {
    this.dialog.close(true)
  }

}
