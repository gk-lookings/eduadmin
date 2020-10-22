import { Component, OnInit } from '@angular/core';
import { ApiService } from './../services';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from './../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { GET_TEMPLATE, LOGIN } from '../config/endpoints';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.css']
})
export class CreateDocumentComponent implements OnInit {

  tempSubject: string;
  tempName: string;
  responseMessage: string;
  isLoading: boolean;
  success: boolean;
  tempNameFormControl = new FormControl('', Validators.required);
  tempSubjectControl = new FormControl()
  createTemplateForm: FormGroup = new FormGroup({
    tempName: this.tempNameFormControl,
    tempSubject: this.tempSubjectControl
  });

  tempId = this.activatedRoute.snapshot.params['tempId'];
  subjectName = this.activatedRoute.snapshot.params['subName'].replace(/\d+% ?/g, "");

  subject_detail
  template

  subjects=[]

  files: any[] = [];
  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthenticationService,
    private http: HttpClient,
    public _location: Location,
    private activatedRoute: ActivatedRoute
  ) { }

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
            if (res.data.subjects[i].subject == this.subjectName) {
              this.subject_detail = res.data.subjects[i];
            }
            else
            {
              this.subjects.push(res.data.subjects[i])
            }
          }
        }
      })
  }

  submitForm() {
    this.isLoading = true
    let tempArr = this.subject_detail.documents.concat({
      "title": this.tempName,
      "files": []
    })
    this.subject_detail.documents = tempArr

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
          this.responseMessage = 'Document has been created succefully.!'
          this.createTemplateForm.reset()
        }
      })
  }

  getNameErrorMessage() {
    return this.tempNameFormControl.hasError('required') ? '*You must enter a value' :
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
      this.files.push(item);
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


  /* 
  for (let i = 0; i < res.data.subjects.length; i++) {
            if (res.data.subjects[i].subject == this.subjectName) {
              this.subject_detail = res.data.subjects[i];
            }
          }          
          this.subject_detail = {
            ...this.subject_detail, documents: [{
              "title": "new docs",
              "files": [
                {
                  "url": "https://image.com",
                  "name": "new image"
                }
              ]
            }, {
              "title": "new docs2",
              "files": [
                {
                  "url": "https://image.com",
                  "name": "new image"
                }
              ]
            }]
          }
  
  */
}