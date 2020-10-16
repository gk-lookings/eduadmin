import { Component, OnInit } from '@angular/core';
import { ApiService } from './../services';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from './../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { GET_TEMPLATE, LOGIN, SUBJECT, TEMPLATE_CREATE, TEMPLATE_LIST } from '../config/endpoints';

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


  subjects= [
    
  ];

  categorys = [];
  subSelected = [];

  constructor(private apiService: ApiService, private router: Router, private spinner: NgxSpinnerService, private authService: AuthenticationService, private http: HttpClient, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getSubjects()
    this.getDetail()
  }

  getDetail(){
    let params = {}
    this.spinner.show();
    let arr = []
    this.apiService.getResponse('get', GET_TEMPLATE + this.__tempId, params).
      then(res => {
        console.log("getDetail", res);
        this.spinner.hide();
        if(res.status === 200)
        {

          this.tempName = res.data.name
          this.tempId = res.data.templateId
          this.tags = res.data.descriptionTags
          if(res.data.subjects)
          {
            res.data.subjects.forEach(element => {
              arr.push(element.subjectId)
            });
          }
          this.subSelected = arr
        }
      })
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

  submitForm() {
   
    let subpush = []
    this.subjects.forEach((element) => {
      this.subSelected.forEach(el => {
        if (element.name === el) {
          // if (!this.naviDash.includes(el))
          subpush.push(element)
        }
      });
    });
    console.log("subelected", subpush);
    // let params = {
    //   "templateId": this.tempId,
    //   "name": this.tempName,
    //   "descriptionTags": this.tags,
    //   "active": true,
    //   "about": "string",
    // }
    // this.apiService.getResponse('put', GET_TEMPLATE + this.__tempId, params).
    //   then(res => {
    //     this.isLoading = false;
    //     console.log("res", res);

    //     if (res.status === 200) {
    //       this.success =true
    //       this.responseMessage = 'Template has been updated succefully..!'
    //       setTimeout(() => {
    //         this.responseMessage = ''
    //       }, 3000);
    //     }
    //     else {
    //       this.responseMessage = res.message
    //     }
    //   })




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