import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { GET_TEMPLATE, SUBJECT } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.css']
})
export class EditSubjectComponent implements OnInit {

 
  subId: string;
  subName: string;
  responseMessage: string;
  isLoading: boolean = false
  success: boolean;
  subNameFormControl = new FormControl('', Validators.required);
  subInstructor
  createForm: FormGroup = new FormGroup({
    subName: this.subNameFormControl
  });

  constructor( @Inject(MAT_DIALOG_DATA) public subject: any, public dialogRef : MatDialogRef<EditSubjectComponent>) { }

  ngOnInit() {
    this.subName = this.subject
  }

  getNameErrorMessage() {
    return this.subNameFormControl.hasError('required') ? '*You must enter a value' :
      '';
  }

  submit() { 
    this.dialogRef.close(this.subName)
  }

}
