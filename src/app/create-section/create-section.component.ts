import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
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

  tempId = this.activatedRoute.snapshot.params['tempId'];
  subjectName = this.activatedRoute.snapshot.params['subName'];

  constructor(private apiService: ApiService,
    private router: Router, 
    private authService: AuthenticationService,
     private http: HttpClient,
     public _location: Location,
     private activatedRoute: ActivatedRoute,
     private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.fetchTemplate()
  }

  fetchTemplate() {
    let params = {}
    this.apiService.getResponse('get', GET_TEMPLATE + this.tempId, params).
      then(res => {
        if (res.status === 200) {
          this.template = res.data
          for (let i = 0; i < res.data.subjects.length; i++) {
            if (res.data.subjects[i]._id == this.subjectName) {
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
      "description": this.subDesc
    })
    this.subject_detail.sections = tempArr

    // let params = {
    //   "title": this.subName,
    //   "description": this.subDesc
    // }
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
          let snackBarRef = this._snackBar.open('Section has been created succefully..!', '', { duration: 1500, panelClass: 'snackbar' });
          setTimeout(() => {
            this.responseMessage = ''
            this._location.back()
          }, 500);
          this.createForm.reset()
        }
        else {
          let snackBarRef = this._snackBar.open(res.error.data, '', { duration: 1500, panelClass: 'snackbar' });
        }
      })
  }
  getNameErrorMessage() {
    return this.subNameFormControl.hasError('required') ? '*You must enter a value' :
      '';
  }

}
