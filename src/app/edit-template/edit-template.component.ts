import { Component, OnInit } from '@angular/core';
import { ApiService } from './../services';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from './../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { GET_TEMPLATE, HOST, LOGIN, SUBJECT, TEMPLATE_CREATE, TEMPLATE_LIST } from '../config/endpoints';

import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.css']
})
export class EditTemplateComponent implements OnInit {

  tempId: string;
  tempName: string;
  responseMessage: string;
  isLoading: boolean;
  success: boolean;
  tempIdControl = new FormControl('', [Validators.required]);
  tempNameFormControl = new FormControl('', Validators.required);

  createTemplateForm: FormGroup = new FormGroup({
    tempId: this.tempIdControl,
    tempName: this.tempNameFormControl
  });

  files: any[] = [];

  __tempId = this.activatedRoute.snapshot.params['tempId'];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags = [];
  logo
  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private authService: AuthenticationService, private http: HttpClient, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getDetail()
  }

  getDetail() {
    let params = {}
    this.spinner.show();
    let arr = []
    this.apiService.getResponse('get', GET_TEMPLATE + this.__tempId, params).
      then(res => {
        this.spinner.hide();        
        if (res.status === 200) {
          this.tempName = res.data.name
          this.tempId = res.data.templateId
          this.tags = res.data.descriptionTags
          this.logo = res.data.logo
        }
      })
  }

  submitForm() {
    this.isLoading = true
    var image
    var re = /(?:\.([^.]+))?$/;
    if (this.files.length != 0) {
      const formData = new FormData();
      formData.append('file', this.files[0]);
      this.apiService.getResponse('post', HOST + 'misc/s3-upload?path=template/template/logo/' + this.tempId + '.' + re.exec(this.files[0].name)[1], formData).then(res => {
        image = res.data.imageURL
        if (res.status === 200) {
          let params = {
            "templateId": this.tempId,
            "name": this.tempName,
            "descriptionTags": this.tags,
            "logo": image
          }
          this.apiService.getResponse('put', GET_TEMPLATE + this.__tempId, params).
            then(res => {
              this.isLoading = false;
              if (res.status === 200) {
                this.success = true
                this.responseMessage = 'Template has been updated succefully..!'
                setTimeout(() => {
                  this.responseMessage = ''
                }, 3000);
                this.files = []
                this.apiService.getResponse('get', GET_TEMPLATE + this.__tempId, {}).
                  then(res => {
                    this.spinner.hide();
                    if (res.status === 200) {
                      this.tempName = res.data.name
                      this.tempId = res.data.templateId
                      this.tags = res.data.descriptionTags
                      this.logo = res.data.logo
                    }
                  })
              }
              else {
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
        "templateId": this.tempId,
        "name": this.tempName,
        "descriptionTags": this.tags,
      }
      this.apiService.getResponse('put', GET_TEMPLATE + this.__tempId, params).
        then(res => {
          this.isLoading = false;
          if (res.status === 200) {
            this.success = true
            this.responseMessage = 'Template has been updated succefully..!'
            setTimeout(() => {
              this.responseMessage = ''
            }, 3000);
          }
          else {
            this.responseMessage = res.error.data
          }
        })
    }
  }



  getNameErrorMessage() {
    return this.tempNameFormControl.hasError('required') ? '*You must enter a value' :
      '';
  }

  getIDErrorMessage() {
    return this.tempIdControl.hasError('required') ? '*You must enter a value' :
      '';
  }

  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
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


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  remove(tag): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

}