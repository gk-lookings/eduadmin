import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ACTIVITY, DASHBOARD } from '../config/endpoints';
import { LogOutModelComponent } from '../log-out-model/log-out-model.component';
import { ApiService } from '../services';

import { DashboardComponent } from '../dashboard/dashboard.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  stdCount = 0
  classCount = 0
  tempCount = 0


  currentPage = 0
  actvities = []
  isLastpage
  loadMore = false

  isLoadActvity = false

  constructor(private dialog: MatDialog, private apiService: ApiService, private dashboard: DashboardComponent) { }

  ngOnInit() {
    this.dashboard.setPageTitle('');
    this.fetchActivity()
    this.fetchGlobalActivity()
  }

  fetchActivity() {
    let params = {}
    this.apiService.getResponse('get', DASHBOARD, params).
      then(res => {
        if (res.status === 200) {
          this.tempCount = res.data.templates
          this.classCount = res.data.classRooms
          this.stdCount = res.data.users
        }
      })
  }

  fetchGlobalActivity() {
    if (!this.isLastpage) {
      this.isLoadActvity = true
      let params = { offset: this.currentPage, }
      this.apiService.getResponse('get', ACTIVITY + '?modules=CLASSROOM&modules=USER', params).
        then(res => {
          if (res.status === 200) {
            this.isLoadActvity = false
            this.actvities = this.actvities.concat(res.data.activity)
            this.isLastpage = res.data.isLastPage
          }
        })
    }
  }
  // showMore()
  // {
  //   this.loadMore = false
  //   this.currentPage++
  //   this.fetchGlobalActivity()
  // }

  @HostListener("window:scroll", ['$event'])
  scrollMe(event) {
    if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight)) {
      if (!this.isLastpage) {
        this.currentPage++
        this.fetchGlobalActivity()
      }
    }
  }
}
