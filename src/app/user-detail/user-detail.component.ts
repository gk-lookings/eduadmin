import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CLASSROOM, ACTIVITY, USER_DETAILS, USER_DEACTIVATE } from '../config/endpoints';
import { ApiService } from '../services';

import { DashboardComponent } from '../dashboard/dashboard.component';
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user
  isLoading

  isActive
  popoverTitle = 'Are you sure?';
  popoverMessage = 'Are you really want to do this ?';
  confirmClicked = false;
  cancelClicked = false;

  currentPage = 0
  actvities =[]
  isLastpage
  loadMore = false

  isLoadActvity = false

  classRooms=[]
  userId = this.activatedRoute.snapshot.params['userId'];

  constructor(private apiService: ApiService, private dashboard : DashboardComponent, public _location: Location, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
this.dashboard.setPageTitle('User');
    this.fetchUserActivity()
    this.fetchUser()
  }
  fetchUser() {
    this.isLoading = true;
    let params = {userId : this.userId}
    this.apiService.getResponse('get', USER_DETAILS, params).
      then(res => {
        this.isLoading = false;
        if (res.status === 200) {
          this.user = res.data.data
          this.isActive = res.data.data.active
          this.classRooms = res.data.data.classRooms
        }
      })
  }
  deactivate() {
    if (this.isActive) {
      let params = { userId: this.userId }
      this.apiService.getResponse('get', USER_DEACTIVATE, params).
        then(res => {
          if (res.status === 200) {
            this.isActive = !this.isActive
          }
        })
    }
    else {
      let params = { 'active': !this.isActive }
      this.apiService.getResponse('get', USER_DETAILS +'/'+ this.userId +'/activate',).
        then(res => {
          if (res.status === 200) {
            this.isActive = !this.isActive
          }
        })
    }
  }

  fetchUserActivity() {
    if(!this.isLastpage){
      this.isLoadActvity = true
    let params = { userId: this.userId, offset: this.currentPage }
    this.apiService.getResponse('get', ACTIVITY, params).
      then(res => {
        if (res.status === 200) {
          this.isLoadActvity = false
          this.actvities = this.actvities.concat(res.data.activity)
          this.isLastpage = res.data.isLastPage
          if(!res.data.isLastPage)
          this.loadMore = true
        }
      })
    }
  }
  // showMore()
  // {
  //   this.currentPage++
  //   this.fetchUserActivity()
  // }

  @HostListener("window:scroll", ['$event'])
  scrollMe(event) {
    if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight)) {
      if (!this.isLastpage) {
        this.currentPage++
        this.fetchUserActivity()
      }
    }
  }
  

}
