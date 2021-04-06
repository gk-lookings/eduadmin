import { Component, OnInit } from '@angular/core';
import { ApiService } from './../services';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from './../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { GET_TEMPLATE, HOST } from '../config/endpoints';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { DashboardComponent } from '../dashboard/dashboard.component';
@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.css']
})
export class CreateNoteComponent implements OnInit {

  tempSubject: string;
  tempName: string;

  responseMessage: string;
  isLoading: boolean;
  success: boolean;

  tempNameFormControl = new FormControl('', Validators.required);
  tempSubjectControl = new FormControl();

  createTemplateForm: FormGroup = new FormGroup({
    tempName: this.tempNameFormControl,
    tempSubject: this.tempSubjectControl
  });

  tempId = this.activatedRoute.snapshot.params['tempId'];
  subjectName = this.activatedRoute.snapshot.params['subName'];
  template
  subject_detail
  subjects = []

  files: any[] = [];
  fileArray: any[] = [];
  
  constructor(private apiService: ApiService, private dashboard : DashboardComponent, private router: Router, private _snackBar: MatSnackBar, private authService: AuthenticationService, private http: HttpClient, public _location: Location,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
this.dashboard.setPageTitle('Create Note');
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
    let newArray = []
    var fileArray = []
    var re = /(?:\.([^.]+))?$/;
   
    if (this.files.length != 0) {
      for (let i = 0; i < this.files.length; i++) {
        const formData = new FormData();
        formData.append('file', this.files[i]);
        let elem = this.apiService.getResponse('post', HOST + 'misc/s3-upload?path=template/' + this.template.id + '/notes/' + this.files[i].lastModified + '.' + re.exec(this.files[i].name)[1], formData)
        fileArray.push(elem)
      }
      Promise.all(fileArray).then(res => {
        for (let m = 0; m < this.files.length; m++) {
          for (let n = m; n < res.length; n++) {
            if(m==n) {
            newArray.push({
              "_id": this.files[m].lastModified + this.files[m].name,
              "name": this.files[m].name,
              "size": this.files[m].size,
              "type": this.files[m].type,
              "url": res[n].data.imageURL,
              "createdAt": new Date()
            })
          }
          }
        }

        let params = {
          "title": this.tempName,
          "description": this.tempSubject,
          "files": newArray
        }

        this.apiService.getResponse('put', GET_TEMPLATE + this.template._id + '/append?type=note&subjectId=' + this.subjectName, params).
          then(res => {
            if (res.status === 200) {
              this.isLoading = false
              this.success = true
              let snackBarRef = this._snackBar.open('Note has been created succefully.!', '', { duration: 1500, panelClass: 'snackbar' });
              setTimeout(() => {
                this.responseMessage = ''
                this._location.back()
              }, 500);
              this.createTemplateForm.reset()
              this.files = []
            }
            else {
              let snackBarRef = this._snackBar.open(res.error.data, '', { duration: 1500, panelClass: 'snackbar' });
            }
          })

      }).catch(err => {
        console.log("error", err);
      })
    }
    else {
      let params = {
        "title": this.tempName,
        "description": this.tempSubject,
      }
      this.apiService.getResponse('put', GET_TEMPLATE + this.template._id + '/append?type=note&subjectId=' + this.subjectName, params).
        then(res => {
          if (res.status === 200) {
            this.isLoading = false
            this.success = true
            let snackBarRef = this._snackBar.open('Note has been created succefully.!', '', { duration: 1500, panelClass: 'snackbar' });
            setTimeout(() => {
              this.responseMessage = ''
              this._location.back()
            }, 500);
            this.createTemplateForm.reset()
            this.files = []
          }
          else {
            let snackBarRef = this._snackBar.open(res.error.data, '', { duration: 1500, panelClass: 'snackbar' });
          }
        })
    }

  }

  getNameErrorMessage() {
    return this.tempNameFormControl.hasError('required') ? '*You must enter a value' :
      '';
  }
  getSubErrorMessage() {
    return this.tempSubjectControl.hasError('required') ? '*You must enter a value' :
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

  
  keepUnique(data, key) {
    return [... new Map(data.map(x => [key(x), x])).values()]
  }


  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.fileArray.push(item);
    }
    if (this.files.length > 0) {
      this.files = this.keepUnique(this.files.concat(this.fileArray), it => it.name )
    }
    else {
      this.files = this.fileArray
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