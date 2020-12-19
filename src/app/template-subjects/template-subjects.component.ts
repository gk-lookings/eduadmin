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

@Component({
  selector: 'app-template-subjects',
  templateUrl: './template-subjects.component.html',
  styleUrls: ['./template-subjects.component.css']
})
export class TemplateSubjectsComponent implements OnInit {
  template
  tempId = this.activatedRoute.snapshot.params['tempId'];
  isLoading
  subjects=[]
  isLastpage = false
  currentPage = 0
  isEmpty = false
  constructor(
        private apiService: ApiService,
        public _location: Location,
        private router: Router,
        private authService: AuthenticationService,
        private activatedRoute: ActivatedRoute,
        private spinner: NgxSpinnerService,
        public dialog : MatDialog
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
          if(this.subjects.length==0)
          this.isEmpty = true
        }
      })
  }
 
  createSub() {
    const open = this.dialog.open(CreateSubjectComponent, { data: this.template })
    open.afterClosed().subscribe(result => {
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

}
