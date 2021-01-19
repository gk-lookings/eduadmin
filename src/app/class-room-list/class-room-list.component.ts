import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CLASSROOM_LIST } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';
@Component({
  selector: 'app-class-room-list',
  templateUrl: './class-room-list.component.html',
  styleUrls: ['./class-room-list.component.css']
})
export class ClassRoomListComponent implements OnInit {
  searchkey=''
  isLoading = true
  classes = []
  isLastpage = false
  isEmpty = false
  currentPage = 0
  txtQueryChanged = new Subject<string>();
  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, public dialog: MatDialog) {
    this.txtQueryChanged.pipe(debounceTime(1000), distinctUntilChanged())
    .subscribe(model => {
      this.searchkey = model;
      this.classes= []
      this.isLastpage = false
      this.currentPage = 0
      this.isLoading = false
      this.fetchList()
     });
   }

  ngOnInit() {
    this.fetchList()
  }

  searchResults(query:string) {
    this.txtQueryChanged.next(query);
  }

  fetchList() {
    if (!this.isLastpage) {
      this.isLoading = true;
      this.isEmpty = false
      let params = { term: this.searchkey, offset: this.currentPage, count :30 }
      this.apiService.getResponse('get', CLASSROOM_LIST, params).
        then(res => {
          this.isLoading = false;
          if (res.status === 200) {
            this.classes = this.classes.concat(res.data.classRooms)
            this.isLastpage = (res.data.classRooms.length == 0) ? true : false
            if(this.classes.length == 0)
            this.isEmpty = true
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
