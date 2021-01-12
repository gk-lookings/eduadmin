import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GET_TEMPLATE, TEMPLATE_LIST } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog } from '@angular/material';
import { ConfirmDeleteModelComponent } from '../confirm-delete-model/confirm-delete-model.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.css']
})
export class TemplateListComponent implements OnInit {
  isLoading
  templates =[]
  isLastpage = false
  currentPage = 0
  searchkey=''
  txtQueryChanged = new Subject<string>();
  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, private spinner: NgxSpinnerService, public dialog :MatDialog) {
    this.txtQueryChanged.pipe(debounceTime(1000), distinctUntilChanged())
            .subscribe(model => {
              this.searchkey = model;
              this.templates= []
              this.isLastpage = false
              this.currentPage = 0
              this.isLoading = false
              this.fetchList()
             });
   }

  ngOnInit() {
    this.fetchList()
  }

  fetchList() {
    if (!this.isLastpage) {
      this.isLoading = true;
      let params = { term: this.searchkey, offset: this.currentPage, count :10 }
      this.apiService.getResponse('get', TEMPLATE_LIST, params).
        then(res => {
          this.isLoading = false;
          if (res.status === 200) {
            this.templates = this.templates.concat(res.data.templates)
            this.isLastpage = (res.data.templates.length == 0) ? true : false
          }
        })
    }
  }

  searchResults(query:string) {
    this.txtQueryChanged.next(query);
  }


  deleteTemp(id) {
    const opendialog = this.dialog.open(ConfirmDeleteModelComponent).afterClosed().subscribe(result => {
      if (result) {
        let params = {}
        this.apiService.getResponse('delete', GET_TEMPLATE + id, params).
          then(res => {
            if (res.status === 200) {
              let par = { term: this.searchkey, offset: 0, count :10 }
              this.apiService.getResponse('get', TEMPLATE_LIST, par).
                then(res => {
                  if (res.status === 200) {
                    this.templates = res.data.templates
                    this.isLastpage = (res.data.templates.length == 0) ? true : false
                  }
                })
            }
          })
      }
    }
    )
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
