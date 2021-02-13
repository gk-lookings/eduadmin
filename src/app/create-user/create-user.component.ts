import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './../services';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from './../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FILTER, HOST, SUBJECT, TEMPLATE_CREATE, TEMPLATE_LIST, USER_DETAILS } from '../config/endpoints';
import { Location } from '@angular/common';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatDialog } from '@angular/material';
import { FilterAddModelComponent } from '../filter-add-model/filter-add-model.component';
import { WarningPopupComponent } from '../warning-popup/warning-popup.component';

import { UUID } from 'angular2-uuid';



@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  tempId: string;
  tempName: string;
  responseMessage: string;
  isLoading: boolean;
  success: boolean;
  firstNameControl = new FormControl('', [Validators.required]);
  lastNameControl = new FormControl('', [Validators.required]);
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required]);
  roleControl

  createForm: FormGroup = new FormGroup({
    firstName: this.firstNameControl,
    lastName: this.lastNameControl,
    email: this.emailControl,
    password: this.passwordControl
  });

  files: any[] = [];
  phone


  firstName
  lastName
  phoneNumber
  email
  password
  userType = 'PROMOTER'

  countryCode = 91



  constructor(private apiService: ApiService, public _location: Location, private router: Router, private authService: AuthenticationService, private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit() {
  }


  getFirstNameErrorMessage() {
    return this.firstNameControl.hasError('required') ? '*You must enter a value' :
      '';
  }

  getLastNameErrorMessage() {
    return this.lastNameControl.hasError('required') ? '*You must enter a value' :
      '';
  }

  getEmailErrorMessage() {
    return this.emailControl.hasError('required') ? 'You must enter a value' :
      this.emailControl.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    return this.passwordControl.hasError('required') ? '*You must enter a value' :
      '';
  }






  submitForm() {
    this.isLoading = true
    var image
    var re = /(?:\.([^.]+))?$/;
    if (this.files.length != 0) {
      const formData = new FormData();
      formData.append('file', this.files[0]);
      this.apiService.getResponse('post', HOST + 'misc/s3-upload?path=user-admin/user/profile/' + this.files[0].lastModified + '.' + re.exec(this.files[0].name)[1], formData).then(res => {
        image = res.data.imageURL
        if (res.status === 200) {
          let params = {
            "password": this.password,
            "firstName": this.firstName,
            "lastName": this.lastName,
            "profilePic": image,
            "email": this.email,
            "phone": this.phoneNumber,
            "countryCode": "+"+this.countryCode,
            "role": this.userType,
            "active": true
          }
          this.apiService.getResponse('post', USER_DETAILS, params).
            then(res => {
              this.isLoading = false;
              if (res.status === 200) {
                this.success = true
                this.responseMessage = 'User created succefully..!'
                setTimeout(() => {
                  this.responseMessage = ''
                }, 2000);
              }
              else {
                this.success = false
                this.responseMessage = res.error.data
              }
            })
        }
      }).catch(err => {
        this.isLoading = false
        console.log("error", err);
      })
    }
    else {
      let params = {
        "password": this.password,
        "firstName": this.firstName,
        "lastName": this.lastName,
        "email": this.email,
        "phone": this.phoneNumber,
        "countryCode": "+"+this.countryCode,
        "role": this.userType,
        "active": true
      }
      this.apiService.getResponse('post', USER_DETAILS, params).
        then(res => {
          this.isLoading = false;
          if (res.status === 200) {
            this.success = true
            this.responseMessage = 'User created succefully..!'
            setTimeout(() => {
              this.responseMessage = ''
            }, 1000);
          }
          else {
            this.success = false
            this.responseMessage = res.error.data
          }
        })
    }
  }
  onCountryChange(event) {
    this.countryCode = event.dialCode

  }


  onFileDropped($event) {
    if ($event[0].type.indexOf("image") != -1) {
      this.files = []
      this.prepareFilesList($event);
    }
    else {
      let open = this.dialog.open(WarningPopupComponent, { data: 'Only "image" files are allowed.' })
    }

  }

  fileBrowseHandler(files) {
    if (files[0].type.indexOf("image") != -1) {
      this.files = []
      this.prepareFilesList(files);
    }
    else {
      let open = this.dialog.open(WarningPopupComponent, { data: 'Only "image" files are allowed.' })
    }
  }

  deleteFile(index: number) {
    this.files = []
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files = files;
    }
    this.uploadFilesSimulator(0);
  }

  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

}
