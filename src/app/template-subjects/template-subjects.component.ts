import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GET_TEMPLATE, SUBJECT } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';
import { Location } from '@angular/common';

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
  subjects_list = []

  selectedSubjects: any = []

  chck = new FormControl()
  subCheckBox:FormGroup = new FormGroup({
    firstName: this.chck
 });

  constructor(private apiService: ApiService, public _location: Location ,private router: Router, private authService: AuthenticationService, private activatedRoute: ActivatedRoute, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.fetchSubjects()
    this.fetchList()
  }

  fetchSubjects() {
    let params = {}
    this.apiService.getResponse('get', GET_TEMPLATE + this.tempId, params).
      then(res => {
        if (res.status === 200) {
          this.template = res.data
          this.subjects = res.data.subjects
        }
      })
  }

  fetchList() {
    if (!this.isLastpage) {
      this.isLoading = true;
      let params = { text: '', offset: this.currentPage }
      this.apiService.getResponse('get', SUBJECT, params).
        then(res => {
          this.isLoading = false;
          if (res.status === 200) {
            this.subjects_list = this.subjects_list.concat(res.data.subject)
            this.isLastpage = res.data.isLastPage
          }
        })
    }
  }

  addSub(event, sub) {
    if (event)
      this.selectedSubjects.push(sub)
    else {
      var index = this.selectedSubjects.indexOf(sub)
      this.selectedSubjects.splice(index, 1)
    }
  }
  createSub() {
    let subsArray = []
    this.selectedSubjects.forEach(element => {
      subsArray.push({ "subjectId": element._id })
    });
    let params = {
      "templateId": this.tempId,
      "name": this.template.name,
      "descriptionTags": this.template.descriptionTags,
      "active": this.template.active,
      "about": this.template.about,
      "subjects": this.subjects.concat(subsArray)
    }
    this.apiService.getResponse('put', GET_TEMPLATE + this.tempId, params).
      then(res => {
        if (res.status === 200) {
          this.subCheckBox.reset()
          this.fetchSubjects()
        }
      })
  }


  deleteSub(sub) {
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

  @HostListener("window:scroll", ['$event'])
  scrollMe(event) {
    if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight)) {
      if (!this.isLastpage) {
        this.currentPage++
        this.fetchList()
      }
    }
  }

}
