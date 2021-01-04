import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-filter-add-model',
  templateUrl: './filter-add-model.component.html',
  styleUrls: ['./filter-add-model.component.css']
})
export class FilterAddModelComponent implements OnInit {

  title
  titleFormControl = new FormControl('', Validators.required);
  createForm: FormGroup = new FormGroup({
    title: this.titleFormControl,
  });
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog : MatDialogRef<FilterAddModelComponent>) { }

  ngOnInit() {
  }

  close(){
    let close = this.dialog.close()
  }
  submit(){
    let close = this.dialog.close(this.title)
  }
  getNameErrorMessage() {
    return this.titleFormControl.hasError('required') ? '*You must enter a value' :
      '';
  }

}
