import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CLASSROOM_LIST, USERS_LIST } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';

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

  txtQueryChanged = new Subject<string>();
  
  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, public dialog: MatDialog) {
    this.txtQueryChanged.pipe(debounceTime(1000), distinctUntilChanged())
            .subscribe(model => {
              this.searchkey = model;
              this.users= []
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
      this.apiService.getResponse('get', USERS_LIST, params).
        then(res => {
          this.isLoading = false;
          if (res.status === 200) {
            this.users = this.users.concat(res.data.users)
            this.isLastpage = (res.data.users.length == 0) ? true : false
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
