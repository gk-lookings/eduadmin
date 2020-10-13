import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TEMPLATE_LIST } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.css']
})
export class TemplateListComponent implements OnInit {
  isLoading
  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService) { }

  ngOnInit() {
  }

  fetchList() {
    this.isLoading = true;
    let params = { }
    this.apiService.getResponse('get', TEMPLATE_LIST, params).
      then(res => {
        this.isLoading = false;
        if (res.status === 200) {
          
        }
        else {
          
        }
      })
  }

}
