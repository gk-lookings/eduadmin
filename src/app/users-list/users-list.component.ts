import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { USERS_LIST, USER_COMPLETE, USER_DEACTIVATE, USER_DETAILS } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';
import { DashboardComponent } from '../dashboard/dashboard.component';
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  searchkey=''
  isLoading = true
  users = []
  isLastpage = false
  currentPage = 0
  isEmpty = false
  txtQueryChanged = new Subject<string>();
  
  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, public dialog: MatDialog, private dashboardComp : DashboardComponent) {
    this.txtQueryChanged.pipe(debounceTime(1000), distinctUntilChanged())
            .subscribe(model => {
              this.searchkey = model;
              this.users= []
              this.isLastpage = false
              this.currentPage = 0
              this.isLoading = false
              this.isEmpty = false
              this.fetchList()
             });
   }

  ngOnInit() {
    this.dashboardComp.setPageTitle('Users')
    this.fetchList()
  }

  fetchList() {
    if (!this.isLastpage) {
      this.isLoading = true;
      let params = { text: this.searchkey, offset: this.currentPage, count: 30 }
      // (this.searchkey != '') ? USERS_LIST :
      this.apiService.getResponse('get', USER_COMPLETE, params).
        then(res => {
          this.isLoading = false;
          if (res.status === 200) {
            this.users = this.users.concat(res.data.users)
            this.isLastpage = (res.data.users.length == 0) ? true : false
            if(this.users.length == 0)
            this.isEmpty = true
          }
        })
    }
  }

  searchResults(query:string) {
    this.txtQueryChanged.next(query);
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
