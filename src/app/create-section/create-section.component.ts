import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { GET_TEMPLATE } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';

@Component({
  selector: 'app-create-section',
  templateUrl: './create-section.component.html',
  styleUrls: ['./create-section.component.css']
})
export class CreateSectionComponent implements OnInit {


  subId: string;
  subName: string;
  subDesc
  responseMessage: string;
  isLoading: boolean;
  success: boolean;
  subNameFormControl = new FormControl('', Validators.required);
  subDesControl  =new FormControl()
  subject_detail
  template
  subjects = []
  createForm: FormGroup = new FormGroup({
    subName: this.subNameFormControl,
    subDesc: this.subDesControl
  });

  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, private http: HttpClient, @Inject(MAT_DIALOG_DATA) public ids: any, public dialogRef: MatDialogRef<CreateSectionComponent>) { }

  ngOnInit() {
    console.log("ids", this.ids);
    this.fetchTemplate()
  }

  fetchTemplate() {
    let params = {}
    this.apiService.getResponse('get', GET_TEMPLATE + this.ids.tempId, params).
      then(res => {
        if (res.status === 200) {
          this.template = res.data
          for (let i = 0; i < res.data.subjects.length; i++) {
            if (res.data.subjects[i]._id == this.ids.subjectName) {
              this.subject_detail = res.data.subjects[i];
            }
            else {
              this.subjects.push(res.data.subjects[i])
            }
          }
        }
      })
  }

  submitForm() {
    this.isLoading = true
    let tempArr = this.subject_detail.sections.concat({
      "title": this.subName,
      "descripiton": this.subDesc
    })
    this.subject_detail.sections = tempArr

    let params = {
      "templateId": this.template.id,
      "name": this.template.name,
      "descriptionTags": this.template.descriptionTags,
      "active": this.template.active,
      "about": this.template.about,
      "subjects": this.subjects.concat(this.subject_detail)
    }
    this.apiService.getResponse('put', GET_TEMPLATE + this.template._id, params).
      then(res => {
        if (res.status === 200) {
          this.isLoading = false
          this.success = true
          this.responseMessage = 'Note has been created succefully.!'
          setTimeout(() => {
            this.responseMessage = ''
          }, 3000);
          this.createForm.reset()
        }
      })
  }
  getNameErrorMessage() {
    return this.subNameFormControl.hasError('required') ? '*You must enter a value' :
      '';
  }

}
