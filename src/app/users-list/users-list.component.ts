import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CLASSROOM_LIST, USERS_LIST } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  searchkey
  isLoading = true
  users = []
  isLastpage = false
  currentPage = 0
  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, public dialog: MatDialog) { }

  ngOnInit() {
    this.fetchList()
  }

  fetchList() {
    if (!this.isLastpage) {
      this.isLoading = true;
      let params = { text: '', offset: this.currentPage }
      this.apiService.getResponse('get', USERS_LIST, params).
        then(res => {
          this.isLoading = false;
          console.log("useres", res);
          
          if (res.status === 200) {
            this.users = this.users.concat(res.data.users)
            this.isLastpage = res.data.isLastPage
          }
        })
    }
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
