import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CLASSROOM_LIST, TEMPLATE_LIST } from '../config/endpoints';
import { LogOutModelComponent } from '../log-out-model/log-out-model.component';
import { ApiService } from '../services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  stdCount = 0
  classCount = 0
  tempCount = 0
  constructor(private dialog: MatDialog, private apiService: ApiService,) { }

  ngOnInit() {
    this.fetchTempList()
    this.fetchClassList()
  }
  logOut() {
    const abc = this.dialog.open(LogOutModelComponent)
  }

  fetchTempList() {
    let params = { text: '', offset: 0 }
    this.apiService.getResponse('get', TEMPLATE_LIST, params).
      then(res => {
        this.tempCount = res.data.templates.length
      })
  }
  fetchClassList() {
    let params = { text: '', offset: 0 }
    this.apiService.getResponse('get', CLASSROOM_LIST, params).
      then(res => {
        if (res.status === 200) {
          this.classCount = res.data.classRooms.length
        }
      })
  }
}
