import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GET_TEMPLATE } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';

@Component({
  selector: 'app-template-detail',
  templateUrl: './template-detail.component.html',
  styleUrls: ['./template-detail.component.css']
})
export class TemplateDetailComponent implements OnInit {

  template
  tempId = this.activatedRoute.snapshot.params['tempId'];
  subjectName = this.activatedRoute.snapshot.params['subName'];
  isLoading = true

  subject_detail
  document_count = 0
  curriculum_count = 0
  notes_count = 0

  constructor(private apiService: ApiService,public _location: Location, private router: Router, private authService: AuthenticationService, private activatedRoute: ActivatedRoute, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.fetchList()
  }

  fetchList() {
    this.isLoading = true;
    let params = {}
    this.apiService.getResponse('get', GET_TEMPLATE + this.tempId, params).
      then(res => {
        if (res.status === 200) {
          this.isLoading = false;
          this.template = res.data
          for (let i = 0; i < res.data.subjects.length; i++) {
            if (res.data.subjects[i]._id == this.subjectName) {
              this.subject_detail = res.data.subjects[i];
              this.notes_count = res.data.subjects[i].notes.length
              this.document_count = res.data.subjects[i].documents.length
              this.curriculum_count = res.data.subjects[i].sections.length
            }
          }
        }
      })
  }

}
