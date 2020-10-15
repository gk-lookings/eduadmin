import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  subjects_count = 0
  document_count = 0
  curriculum_count = 0
  notes_count = 0

  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.fetchList()
  }

  fetchList() {
    let params = {}
    this.apiService.getResponse('get', GET_TEMPLATE + this.tempId, params).
      then(res => {
        console.log("res", res);
        if (res.status === 200) {
          this.subjects_count = res.data.subjects.length
        }
      })
  }

}
