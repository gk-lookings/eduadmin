import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GET_TEMPLATE, HOST, SUBJECT } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { CreateSubjectComponent } from '../create-subject/create-subject.component';
import { ConfirmDeleteModelComponent } from '../confirm-delete-model/confirm-delete-model.component';
import { CreateSectionComponent } from '../create-section/create-section.component';
import { EditSectionComponent } from '../edit-section/edit-section.component';
import { UploadFileComponent } from '../upload-file/upload-file.component';
import { ViewFileComponent } from '../view-file/view-file.component';

@Component({
  selector: 'app-template-subjects',
  templateUrl: './template-subjects.component.html',
  styleUrls: ['./template-subjects.component.css']
})
export class TemplateSubjectsComponent implements OnInit {
  template
  tempId = this.activatedRoute.snapshot.params['tempId'];
  isLoading
  subjects
  isLastpage = false
  currentPage = 0
  isEmpty = false

  subArray = ''
  subIndex = -1
  subId

  documents = []
  notes = []
  curriculum = []

  selectedDocument
  selectedNote

  selectedNoteIndex
  selectedDocIndex

  isLoadingNoteFile = false
  isLoadingDocFile = false
  isSelectedDoc = false
  isSelectedNote = false

  isDocumentFileEmpty = false
  isNoteFileEmpty = false

  constructor(
    private apiService: ApiService,
    public _location: Location,
    private router: Router,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.fetchSubjects()
  }

  fetchSubjects() {
    this.isLoading = true
    let params = {}
    this.apiService.getResponse('get', GET_TEMPLATE + this.tempId, params).
      then(res => {
        if (res.status === 200) {
          this.isLoading = false
          this.template = res.data
          this.subjects = res.data.subjects
          if (this.subjects.length != 0) {
            this.subArray = res.data.subjects[0]
            this.documents = res.data.subjects[0].documents
            this.curriculum = res.data.subjects[0].sections
            this.notes = res.data.subjects[0].notes
            this.subId = res.data.subjects[0]._id
            this.subIndex = 0
          }
          if (this.subjects.length == 0)
            this.isEmpty = true
        }
      })
  }

  deleteTemp(id) {
    const opendialog = this.dialog.open(ConfirmDeleteModelComponent).afterClosed().subscribe(result => {
      if (result) {
        let params = {}
        this.apiService.getResponse('delete', GET_TEMPLATE + id, params).
          then(res => {
            if (res.status === 200) {
              this._location.back()
            }
          })
      }
    }
    )
  }

  createSub() {
    const open = this.dialog.open(CreateSubjectComponent, { data: this.template })
    open.afterClosed().subscribe(result => {
      if (this.subjects.length == 0)
        this.subIndex = 0
      this.isEmpty = false
      if (result) {
        this.subjects = result.data.subjects
        let params = {}
        this.apiService.getResponse('get', GET_TEMPLATE + this.tempId, params).
          then(res => {
            if (res.status === 200) {
              this.template = res.data
              this.subjects = res.data.subjects
            }
          })

      }
    })
  }


  deleteSub(sub, subindex) {
    const opendialog = this.dialog.open(ConfirmDeleteModelComponent).afterClosed().subscribe(result => {
      if (result) {
        var index = this.subjects.indexOf(sub)
        this.subjects.splice(index, 1)
        let params = {
          "templateId": this.tempId,
          "name": this.template.name,
          "descriptionTags": this.template.descriptionTags,
          "active": this.template.active,
          "about": this.template.about,
          "subjects": this.subjects
        }
        this.apiService.getResponse('put', GET_TEMPLATE + this.tempId, params).
          then(res => {
            if (res.status === 200) {
              this.template = res.data
              this.subjects = res.data.subjects
              if (this.subjects.length != 0) {
                this.subArray = res.data.subjects[0]
                this.documents = res.data.subjects[0].documents
                this.curriculum = res.data.subjects[0].sections
                this.notes = res.data.subjects[0].notes
                this.subId = res.data.subjects[0]._id
                this.subIndex = 0
              }
              if (this.subjects.length == 0)
                this.isEmpty = true
            }

          })
      }
    })
  }

  createSection() {
    const open = this.dialog.open(CreateSectionComponent, { data: { tempId: this.tempId, subjectName: this.subId } })
    open.afterClosed().subscribe(res => {
      this.isEmpty = false
      if (res) {
        let params = {}
        this.apiService.getResponse('get', GET_TEMPLATE + this.tempId, params).
          then(res => {
            if (res.status === 200) {
              for (let i = 0; i < res.data.subjects.length; i++) {
                if (res.data.subjects[i]._id == this.subId) {
                  this.curriculum = res.data.subjects[i].sections
                }
              }
            }
          })
      }
    })
  }

  editSection(item) {
    const opendial = this.dialog.open(EditSectionComponent, { data: { tempId: this.tempId, item: item, subjectName: this.subId } }).afterClosed().subscribe(res => {
      if (res) {
        this.subArray = res.data.subjects[this.subIndex]
        this.documents = res.data.subjects[this.subIndex].documents
        this.curriculum = res.data.subjects[this.subIndex].sections
        this.notes = res.data.subjects[this.subIndex].notes
        this.subId = res.data.subjects[this.subIndex]._id


      }
    })
  }

  setRow(obj, i) {
    this.subIndex = i
    this.subArray = obj
    this.documents = obj.documents
    this.curriculum = obj.sections
    this.notes = obj.notes
    this.subId = obj._id
    this.isSelectedDoc = false
    this.isSelectedNote = false
  }

  deleteDoc(item, i) {
    const opendialog = this.dialog.open(ConfirmDeleteModelComponent).afterClosed().subscribe(result => {
      if (result) {
        var index = this.documents.indexOf(item)
        this.documents.splice(index, 1)
        this.subjects.documents = this.documents
        let params = {
          "templateId": this.tempId,
          "name": this.template.name,
          "descriptionTags": this.template.descriptionTags,
          "active": this.template.active,
          "about": this.template.about,
          "subjects": this.subjects
        }
        this.apiService.getResponse('put', GET_TEMPLATE + this.tempId, params).
          then(res => {
          })
        if (this.documents.length == 0)
          this.isEmpty = true
      }
    })
  }

  deleteNote(item, i) {
    const opendialog = this.dialog.open(ConfirmDeleteModelComponent).afterClosed().subscribe(result => {
      if (result) {
        var index = this.notes.indexOf(item)
        this.notes.splice(index, 1)
        this.subjects.notes = this.notes
        let params = {
          "templateId": this.tempId,
          "name": this.template.name,
          "descriptionTags": this.template.descriptionTags,
          "active": this.template.active,
          "about": this.template.about,
          "subjects": this.subjects
        }
        this.apiService.getResponse('put', GET_TEMPLATE + this.tempId, params).
          then(res => {
            this.subArray = res.data.subjects[this.subIndex]
            this.documents = res.data.subjects[this.subIndex].documents
            this.curriculum = res.data.subjects[this.subIndex].sections
            this.notes = res.data.subjects[this.subIndex].notes
            this.subId = res.data.subjects[this.subIndex]._id
          })
        if (this.notes.length == 0)
          this.isEmpty = true
      }
    })
  }

  deleteSection(item) {
    const opendialog = this.dialog.open(ConfirmDeleteModelComponent).afterClosed().subscribe(result => {
      if (result) {
        var index = this.curriculum.indexOf(item)
        this.curriculum.splice(index, 1)
        this.subjects[this.subIndex].sections = this.curriculum
        let params = {
          "templateId": this.tempId,
          "name": this.template.name,
          "descriptionTags": this.template.descriptionTags,
          "active": this.template.active,
          "about": this.template.about,
          "subjects": this.subjects
        }
        this.apiService.getResponse('put', GET_TEMPLATE + this.tempId, params).
          then(res => {
            this.subArray = res.data.subjects[this.subIndex]
            this.documents = res.data.subjects[this.subIndex].documents
            this.curriculum = res.data.subjects[this.subIndex].sections
            this.notes = res.data.subjects[this.subIndex].notes
            this.subId = res.data.subjects[this.subIndex]._id
          })
        if (this.curriculum.length == 0)
          this.isEmpty = true
      }
    })
  }

  selectedDoc(item, i) {
    this.selectedDocument = item
    this.selectedDocIndex = i
    if (item.files.length == 0)
      this.isDocumentFileEmpty = true
    else
      this.isDocumentFileEmpty = false
    this.isSelectedDoc = true
  }
  uploadDocFile() {
    let newArray = []
    var fileArray = []
    var re = /(?:\.([^.]+))?$/;
    const dialo = this.dialog.open(UploadFileComponent).afterClosed().subscribe(files => {
      if (files) {
        this.isDocumentFileEmpty = false
        this.isLoadingDocFile = true
        if (files.length != 0) {
          for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('file', files[i]);
            let elem = this.apiService.getResponse('post', HOST + 'misc/s3-upload?path=template/' + this.template.id + '/document/' + files[i].lastModified + '.' + re.exec(files[i].name)[1], formData)
            fileArray.push(elem)
          }
          Promise.all(fileArray).then(res => {
            for (let m = 0; m < files.length; m++) {
              for (let n = m; n < res.length; n++) {
                if (m == n) {
                  newArray.push({
                    "_id": files[m].lastModified + files[m].name,
                    "name": files[m].name,
                    "size": files[m].size,
                    "type": files[m].type,
                    "url": res[n].data.imageURL,
                    "createdAt": new Date()
                  })
                }
              }
            }

            this.isLoadingDocFile = false
            let selec = this.selectedDocument.files
            this.selectedDocument.files = selec.concat(newArray)
            this.documents[this.selectedDocIndex].files = this.selectedDocument.files

            this.subjects[this.subIndex].documents = this.documents
            let params = {
              "templateId": this.template.id,
              "name": this.template.name,
              "descriptionTags": this.template.descriptionTags,
              "active": this.template.active,
              "about": this.template.about,
              "subjects": this.subjects
            }
            this.apiService.getResponse('put', GET_TEMPLATE + this.template._id, params).
              then(res => {
                if (res.status === 200) {
                  this.subArray = res.data.subjects[this.subIndex]
                  this.documents = res.data.subjects[this.subIndex].documents
                  this.curriculum = res.data.subjects[this.subIndex].sections
                  this.notes = res.data.subjects[this.subIndex].notes
                  this.subId = res.data.subjects[this.subIndex]._id
                }
              })

          }).catch(err => {
            console.log("error", err);
          })
        }
      }
    })
  }

  selectNote(item, i) {
    this.selectedNote = item
    this.selectedNoteIndex = i
    if (item.files.length == 0)
      this.isNoteFileEmpty = true
    else
      this.isNoteFileEmpty = false
    this.isSelectedNote = true
  }

  uploadNoteFile() {
    let newArray = []
    var fileArray = []
    var re = /(?:\.([^.]+))?$/;
    const dialo = this.dialog.open(UploadFileComponent).afterClosed().subscribe(files => {
      if (files) {
        this.isNoteFileEmpty = false
        this.isLoadingNoteFile = true
        if (files.length != 0) {
          for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('file', files[i]);
            let elem = this.apiService.getResponse('post', HOST + 'misc/s3-upload?path=template/' + this.template.id + '/notes/' + files[i].lastModified + '.' + re.exec(files[i].name)[1], formData)
            fileArray.push(elem)
          }
          Promise.all(fileArray).then(res => {
            for (let m = 0; m < files.length; m++) {
              for (let n = m; n < res.length; n++) {
                if (m == n) {
                  newArray.push({
                    "_id": files[m].lastModified + files[m].name,
                    "name": files[m].name,
                    "size": files[m].size,
                    "type": files[m].type,
                    "url": res[n].data.imageURL,
                    "createdAt": new Date()
                  })
                }
              }
            }



            this.isLoadingNoteFile = false
            let selec = this.selectedNote.files
            this.selectedNote.files = selec.concat(newArray)
            this.notes[this.selectedNoteIndex].files = this.selectedNote.files
            this.subjects[this.subIndex].notes = this.notes
            let params = {
              "templateId": this.template.id,
              "name": this.template.name,
              "descriptionTags": this.template.descriptionTags,
              "active": this.template.active,
              "about": this.template.about,
              "subjects": this.subjects
            }
            this.apiService.getResponse('put', GET_TEMPLATE + this.template._id, params).
              then(res => {
                if (res.status === 200) {
                  this.subArray = res.data.subjects[this.subIndex]
                  this.documents = res.data.subjects[this.subIndex].documents
                  this.curriculum = res.data.subjects[this.subIndex].sections
                  this.notes = res.data.subjects[this.subIndex].notes
                  this.subId = res.data.subjects[this.subIndex]._id
                }
              })

          }).catch(err => {
            console.log("error", err);
          })
        }


      }
    })
  }
  deleteDocFile(item) {
    const opendialog = this.dialog.open(ConfirmDeleteModelComponent).afterClosed().subscribe(result => {
      if (result) {
        var index = this.selectedDocument.files.indexOf(item)
        this.selectedDocument.files.splice(index, 1)
        this.documents[this.selectedDocIndex].files = this.selectedDocument.files
        this.subjects[this.subIndex].documents = this.documents

        let params = {
          "templateId": this.tempId,
          "name": this.template.name,
          "descriptionTags": this.template.descriptionTags,
          "active": this.template.active,
          "about": this.template.about,
          "subjects": this.subjects
        }
        this.apiService.getResponse('put', GET_TEMPLATE + this.tempId, params).
          then(res => {
          })
        if (this.selectedDocument.files.length == 0)
          this.isDocumentFileEmpty = true
        else
          this.isDocumentFileEmpty = false
      }
    })
  }
  deleteNoteFile(item) {
    const opendialog = this.dialog.open(ConfirmDeleteModelComponent).afterClosed().subscribe(result => {
      if (result) {
        var index = this.selectedNote.files.indexOf(item)
        this.selectedNote.files.splice(index, 1)
        this.notes[this.selectedNoteIndex].files = this.selectedNote.files
        this.subjects[this.subIndex].notes = this.notes

        let params = {
          "templateId": this.tempId,
          "name": this.template.name,
          "descriptionTags": this.template.descriptionTags,
          "active": this.template.active,
          "about": this.template.about,
          "subjects": this.subjects
        }
        this.apiService.getResponse('put', GET_TEMPLATE + this.tempId, params).
          then(res => {
          })
        if (this.selectedNote.files.length == 0)
          this.isNoteFileEmpty = true
        else
          this.isNoteFileEmpty = false
      }
    })
  }

  viewFile(src, type) {
    const opendialog = this.dialog.open(ViewFileComponent, { data: { src: src, type: type } })
  }
}
