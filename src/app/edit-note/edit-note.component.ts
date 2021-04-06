import { Component, OnInit } from '@angular/core';
import { ApiService } from './../services';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from './../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { GET_TEMPLATE, HOST } from '../config/endpoints';
import { Location } from '@angular/common';
import { ConfirmDeleteModelComponent } from '../confirm-delete-model/confirm-delete-model.component';
import { ViewFileComponent } from '../view-file/view-file.component';
import { MatDialog, MatSnackBar } from '@angular/material';

import { DashboardComponent } from '../dashboard/dashboard.component';
@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.css']
})
export class EditNoteComponent implements OnInit {

  tempSubject: string;
  tempName: string;

  responseMessage: string;
  isLoading: boolean;
  success: boolean;

  tempNameFormControl = new FormControl('', Validators.required);
  tempSubjectControl = new FormControl('', Validators.required);

  createTemplateForm: FormGroup = new FormGroup({
    tempName: this.tempNameFormControl,
    // tempSubject: this.tempSubjectControl
  });

  tempId = this.activatedRoute.snapshot.params['tempId'];
  subjectName = this.activatedRoute.snapshot.params['subName'];
  noteId = this.activatedRoute.snapshot.params['noteId'];

  template
  subject_detail
  subjects = []

  files: any[] = [];

  isFetchLoading = false
  index

  noteData

  constructor(private apiService: ApiService, private dashboard : DashboardComponent, private router: Router, private _snackBar: MatSnackBar,private authService: AuthenticationService, private http: HttpClient, public _location: Location,
    private activatedRoute: ActivatedRoute, public dialog : MatDialog) { }

  ngOnInit() {
this.dashboard.setPageTitle('Update Note');
    this.fetchTemplate()
  }

  fetchTemplate() {
    this.isFetchLoading  =true
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
          this.index = this.subject_detail.notes.findIndex((element, index) => {
            if (element._id === this.noteId) {
              return true
            } 
          })
          this.noteData = this.subject_detail.notes[this.index]
          this.tempName = this.subject_detail.notes[this.index].title
          this.tempSubject = this.subject_detail.notes[this.index].description
          this.isFetchLoading= false
        }
      })
  }

  submitForm() {
    this.isLoading = true
    let newArray = []
    var fileArray = []
    var re = /(?:\.([^.]+))?$/;

    this.subject_detail.notes[this.index]._id = this.noteData._id
    this.subject_detail.notes[this.index].title = this.tempName
    this.subject_detail.notes[this.index].description = this.tempSubject

    if (this.files.length != 0) {
      for (let i = 0; i < this.files.length; i++) {
        const formData = new FormData();
        formData.append('file', this.files[i]);
        let elem = this.apiService.getResponse('post', HOST + 'misc/s3-upload?path=template/' + this.template.id + '/notes/' + this.files[i].lastModified + '.' + re.exec(this.files[i].name)[1], formData)
        fileArray.push(elem)
      }
      Promise.all(fileArray).then(res => {
        for (let m = 0; m < this.files.length; m++) {
          for (let n = 0; n < res.length; n++) {
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

        this.subject_detail.notes[this.index].files= this.subject_detail.notes[this.index].files.concat(newArray)

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
              let snackBarRef = this._snackBar.open('Note has been updated succefully.!', '', { duration: 1500, panelClass: 'snackbar' });
              setTimeout(() => {
                this.responseMessage = ''
              }, 3000);
              this.files = []
            }
          })

      }).catch(err => {
        console.log("error", err);
      })
    }
    else {
      this.subject_detail.notes[this.index]._id = this.noteData._id
      this.subject_detail.notes[this.index].title = this.tempName
      this.subject_detail.notes[this.index].files =  this.noteData.files
      this.subject_detail.notes[this.index].description = this.tempSubject

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
            let snackBarRef = this._snackBar.open('Note has been updated succefully.!', '', { duration: 1500, panelClass: 'snackbar' });
            setTimeout(() => {
              this.responseMessage = ''
            }, 3000);
            this.files = []
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

  
  deleteNoteFile(item) {
    const opendialog = this.dialog.open(ConfirmDeleteModelComponent).afterClosed().subscribe(result => {
      if (result) {
        var index = this.noteData.files.indexOf(item)
        this.noteData.files.splice(index, 1)
        this.subject_detail.notes[this.index].files =  this.noteData.files
      }
    })
  }
  viewFile(src, type)
  {
    const opendialog = this.dialog.open(ViewFileComponent, { data: { src : src, type : type }})
  }
}