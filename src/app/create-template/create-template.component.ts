import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './../services';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from './../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LOGIN, SUBJECT, TEMPLATE_CREATE, TEMPLATE_LIST } from '../config/endpoints';

import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.css']
})
export class CreateTemplateComponent implements OnInit {

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


  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags = [];

  subjects: any[] = [];

  categorys = [];
  subSelected = [];

  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, private http: HttpClient) { }

  ngOnInit() {
    this.getSubjects();
    
  }

  submitForm() {
    let params = {
      "templateId": this.tempId,
      "name": this.tempName,
      "descriptionTags": this.tags,
      "active": true,
      "about": "string",
      "subjects" : this.subSelected
    }
    this.apiService.getResponse('post', TEMPLATE_CREATE, params).
      then(res => {
        this.isLoading = false;
        console.log("res", res);

        if (res.status === 200) {
          this.success =true
          this.responseMessage = 'Template created succefully..!'
          setTimeout(() => {
            this.responseMessage = ''
          }, 3000);
          this.tags = []
          this.files = []
          this.createTemplateForm.reset();
        }
        else {
          this.responseMessage = res.message
        }
      })




    /*
    {
      "templateId": "5f7f3e9ee45368b9b5794548",
      "name": "my template",
      "descriptionTags": [
        "chemistry",
        "bTech"
      ],
      "active": true,
      "about": "string",
      "subjects": [
        {
          "subjectId": "5f8057b5ab27d80017fdd2f1",
          "sections": [
            {
              "title": "module 1",
              "description": "module 1 descrption"
            }
          ]
        }
      ],
      "documents": [
        {
          "title": "document title",
          "files": [
            {
              "name": "string",
              "size": 0,
              "type": "string",
              "url": "string"
            }
          ]
        }
      ]
    }
    */

  }

  getSubjects(){
    let params = { text: '', offset: 0 }
      this.apiService.getResponse('get', SUBJECT, params).
        then(res => {
          this.isLoading = false;
          if (res.status === 200) {
            this.subjects = res.data.subject
          }
        })
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