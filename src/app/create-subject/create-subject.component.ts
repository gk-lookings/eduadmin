import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { SUBJECT } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';

@Component({
  selector: 'app-create-subject',
  templateUrl: './create-subject.component.html',
  styleUrls: ['./create-subject.component.css']
})
export class CreateSubjectComponent implements OnInit {

 
  subId: string;
  subName: string;
  responseMessage: string;
  isLoading: boolean;
  success: boolean;
  subNameFormControl = new FormControl('', Validators.required);
  subInstructor
  createForm: FormGroup = new FormGroup({
    subName: this.subNameFormControl
  });

  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, private http: HttpClient, public dialogRef : MatDialogRef<CreateSubjectComponent>) { }

  ngOnInit() {
  }

  getNameErrorMessage() {
    return this.subNameFormControl.hasError('required') ? '*You must enter a value' :
      '';
  }

  submitForm() {
    let params = {
      "name": this.subName,
    }
    this.apiService.getResponse('post', SUBJECT, params).
      then(res => {
        this.isLoading = false;
        console.log("res", res);

        if (res.status === 200) {
          this.dialogRef.close()
          this.createForm.reset();
        }
        else {
          this.responseMessage = res.message
        }
      })
  }

}
