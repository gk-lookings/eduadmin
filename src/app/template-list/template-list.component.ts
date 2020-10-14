import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TEMPLATE_LIST } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.css']
})
export class TemplateListComponent implements OnInit {
  isLoading
  templates
  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.fetchList()
  }

  fetchList() {
    this.isLoading = true;
    this.spinner.show();
    let params = { text: '', offset: 0 }
    this.apiService.getResponse('get', TEMPLATE_LIST, params).
      then(res => {
        this.isLoading = false;
        this.spinner.hide();
        console.log("res", res);
        if (res.status === 200) {
          this.templates = res.data.templates
        }
        else {

        }
      })
  }

}
