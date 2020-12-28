import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DASHBOARD } from '../config/endpoints';
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

  constructor(private dialog: MatDialog, private apiService: ApiService) { }

  ngOnInit() {
    this.fetchActivity()
  }

  logOut() {
    const abc = this.dialog.open(LogOutModelComponent)
  }

  fetchActivity(){
    let params = {}
    this.apiService.getResponse('get', DASHBOARD, params).
      then(res => {
        if (res.status === 200) {
        this.tempCount = res.data.templates
        this.classCount = res.data.classRooms
        this.stdCount= res.data.users
        }
      })
  }
}
