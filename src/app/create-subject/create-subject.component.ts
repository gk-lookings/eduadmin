import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { GET_TEMPLATE, SUBJECT } from '../config/endpoints';
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
  isLoading: boolean = false
  success: boolean;
  subNameFormControl = new FormControl('', Validators.required);
  subInstructor
  createForm: FormGroup = new FormGroup({
    subName: this.subNameFormControl
  });

  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, @Inject(MAT_DIALOG_DATA) public template: any ,private http: HttpClient, public dialogRef : MatDialogRef<CreateSubjectComponent>) { }

  ngOnInit() {
    console.log("template", this.template);
    
  }

  getNameErrorMessage() {
    return this.subNameFormControl.hasError('required') ? '*You must enter a value' :
      '';
  }

  submitForm() {
    this.isLoading = true
    let params = {
      "templateId": this.template._id,
      "name": this.template.name,
      "descriptionTags": this.template.descriptionTags,
      "active": this.template.active,
      "about": this.template.about,
      "subjects": [...this.template.subjects,{"subject" : this.subName}]
    }
    this.apiService.getResponse('put', GET_TEMPLATE + this.template._id, params).
      then(res => {
        if (res.status === 200) {
          this.isLoading = false
          this.dialogRef.close(res)
        }
      })
  }

}
