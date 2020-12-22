import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CLASSROOM_LIST } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';
@Component({
  selector: 'app-class-room-list',
  templateUrl: './class-room-list.component.html',
  styleUrls: ['./class-room-list.component.css']
})
export class ClassRoomListComponent implements OnInit {
  searchkey
  isLoading = true
  classes = []
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
      this.apiService.getResponse('get', CLASSROOM_LIST, params).
        then(res => {
          this.isLoading = false;
          if (res.status === 200) {
            this.classes = this.classes.concat(res.data.classRooms)
            this.isLastpage = res.data.isLastPage
          }
        })
    }
  }

}
