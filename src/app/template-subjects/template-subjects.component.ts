import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GET_TEMPLATE, SUBJECT } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { CreateSubjectComponent } from '../create-subject/create-subject.component';
import { ConfirmDeleteModelComponent } from '../confirm-delete-model/confirm-delete-model.component';
import { CreateSectionComponent } from '../create-section/create-section.component';
import { EditSectionComponent } from '../edit-section/edit-section.component';

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
  subIndex=-1
  subId

  documents =[]
  notes = []
  curriculum = []

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
      this.isEmpty = false
      if (result)
        this.fetchSubjects()
    })
  }


  deleteSub(sub) {
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
          })
      }
    })
  }

  createSection() {
    const open = this.dialog.open(CreateSectionComponent, { data: { tempId: this.tempId, subjectName: this.subId } })
    open.afterClosed().subscribe(result => {
      this.isEmpty = false
      if(result)
      {
        this.subIndex = -1
        this.subArray =''
        this.curriculum =[]
        this.notes = []
        this.documents =[]
        this.fetchSubjects()
      }
    })
  }

  editSection(item) {
    const opendial = this.dialog.open(EditSectionComponent, { data : {tempId : this.tempId, item : item, subjectName : this.subId}}).afterClosed().subscribe(result => {
      if(result)
      {
        this.subIndex = -1
        this.subArray =''
        this.curriculum =[]
        this.notes = []
        this.documents =[]
        this.fetchSubjects()
      }
    })
  }

  setRow(obj, i) {
    this.subIndex = i
    this.subArray = obj
    this.documents = obj.documents
    console.log("Obje", obj);
    
    this.curriculum =obj.sections
    this.notes = obj.notes
    this.subId = obj._id
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
        this.subjects.sections = this.curriculum
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
        if (this.curriculum.length == 0)
          this.isEmpty = true
      }
    })
  }

}
