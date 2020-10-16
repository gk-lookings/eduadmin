import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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

  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, @Inject(MAT_DIALOG_DATA) public data: any ,private http: HttpClient, public dialogRef : MatDialogRef<CreateSubjectComponent>) { }

  ngOnInit() {
    if(this.data){
      this.subName = this.data.name && this.data.name
      this.subInstructor = this.data.instructorName && this.data.instructorName
    }
  }

  getNameErrorMessage() {
    return this.subNameFormControl.hasError('required') ? '*You must enter a value' :
      '';
  }

  submitForm() {
    if(this.data)
    {
      let params = {
        "name": this.subName,
        "instructorName": this.subInstructor
      }
      this.apiService.getResponse('put', SUBJECT +'/'+ this.data._id , params).
        then(res => {
          this.isLoading = false;
          console.log("res", res);
  
          if (res.status === 200) {
            this.dialogRef.close(true)
            this.createForm.reset();
          }
          else {
            this.responseMessage = res.message
          }
        })
    }
    else {
      let params = {
        "name": this.subName,
        "instructorName": this.subInstructor
      }
      this.apiService.getResponse('post', SUBJECT, params).
        then(res => {
          this.isLoading = false;
          console.log("res", res);
  
          if (res.status === 200) {
            this.dialogRef.close(true)
            this.createForm.reset();
          }
          else {
            this.responseMessage = res.message
          }
        })
    }
  }

}
