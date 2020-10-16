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
  isLoading

  subjects_count = 0
  document_count = 0
  curriculum_count = 0
  notes_count = 0

  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, private activatedRoute: ActivatedRoute, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.fetchList()
  }

  fetchList() {
    this.isLoading = true;
    let params = {}
    this.spinner.show();
    this.apiService.getResponse('get', GET_TEMPLATE + this.tempId, params).
      then(res => {
        console.log("res", res);
        if (res.status === 200) {
          this.isLoading = false;
          this.spinner.hide();
          this.template = res.data
          this.subjects_count = res.data.subjects.length
        }
      })
  }

}
