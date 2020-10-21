import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TEMPLATE_LIST } from '../config/endpoints';
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
    this.fetchList()
  }
  logOut() {
    const abc = this.dialog.open(LogOutModelComponent)
  }

  fetchList() {
    let params = { text: '', offset: 0 }
    this.apiService.getResponse('get', TEMPLATE_LIST, params).
      then(res => {
        this.tempCount = res.data.templates.length
      })
  }
}
