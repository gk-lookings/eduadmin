import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { GET_TEMPLATE } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';

@Component({
  selector: 'app-edit-section',
  templateUrl: './edit-section.component.html',
  styleUrls: ['./edit-section.component.css']
})
export class EditSectionComponent implements OnInit {


  subId: string
  subName: string = this.data.item.title
  subDesc = this.data.item.description
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
  });
  sections = []
  index
  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditSectionComponent>) { }

  ngOnInit() {
    this.fetchTemplate()
  }

  fetchTemplate() {
    let params = {}
    this.apiService.getResponse('get', GET_TEMPLATE + this.data.tempId, params).
      then(res => {
        if (res.status === 200) {
          this.template = res.data
          for (let i = 0; i < res.data.subjects.length; i++) {
            if (res.data.subjects[i]._id == this.data.subjectName) {
              this.sections = res.data.subjects[i].sections;
              this.subject_detail = res.data.subjects[i];
            }
            else {
              this.subjects.push(res.data.subjects[i])
            }
          }
          this.index = this.subject_detail.sections.findIndex((element, index) => {
            if (element._id === this.data.item._id) {
              return true
            }
          })
        }
      })
  }

  submitForm() {
    this.isLoading = true
    this.subject_detail.sections[this.index]._id = this.data.item._id
    this.subject_detail.sections[this.index].title = this.subName
    this.subject_detail.sections[this.index].description = this.subDesc
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
          this.responseMessage = 'Section has been updated succefully.!'
          setTimeout(() => {
            this.responseMessage = ''
          }, 3000);
          this.dialogRef.close(res)
        }
      })
  }
  getNameErrorMessage() {
    return this.subNameFormControl.hasError('required') ? '*You must enter a value' :
      '';
  }
}