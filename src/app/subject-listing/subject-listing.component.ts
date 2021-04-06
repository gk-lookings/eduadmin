import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SUBJECT } from '../config/endpoints';
import { CreateSubjectComponent } from '../create-subject/create-subject.component';
import { ApiService, AuthenticationService } from '../services';

import { DashboardComponent } from '../dashboard/dashboard.component';
@Component({
  selector: 'app-subject-listing',
  templateUrl: './subject-listing.component.html',
  styleUrls: ['./subject-listing.component.css']
})
export class SubjectListingComponent implements OnInit {

  isLoading = true
  subjects = []
  isLastpage = false
  currentPage = 0
  constructor(private apiService: ApiService, private dashboard : DashboardComponent, private router: Router, private authService: AuthenticationService, private spinner: NgxSpinnerService, public dialog: MatDialog) { }

  ngOnInit() {
    this.fetchList()
  }

  createSub() {
    const open = this.dialog.open(CreateSubjectComponent)
    open.afterClosed().subscribe(result => {
      if (result) {
        this.currentPage = 0
        this.subjects = []
        this.isLoading = true;
        this.spinner.show();
        this.isLastpage = false
        this.fetchList()
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
            this.subjects = this.subjects.concat(res.data.subject)
            this.isLastpage = res.data.isLastPage
          }
        })
    }
  }


  

  editSub(sub) {
    const open = this.dialog.open(CreateSubjectComponent, { data: sub })
    open.afterClosed().subscribe(result => {
      if (result) {
        this.currentPage = 0
        this.subjects = []
        this.isLoading = true;
        this.spinner.show();
        this.isLastpage = false
        this.fetchList()
      }
    })
  }

  deleteTemp(id) {
    let params = {}
    this.apiService.getResponse('delete', SUBJECT + '/' + id, params).
      then(res => {
        if (res.status === 200) {
          this.currentPage = 0
          this.subjects = []
          let par = { text: '', offset: 0 }
          this.apiService.getResponse('get', SUBJECT, par).
            then(res => {
              if (res.status === 200) {
                this.subjects = res.data.subject
                this.isLastpage = res.isLastPage
              }
            })
        }
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
