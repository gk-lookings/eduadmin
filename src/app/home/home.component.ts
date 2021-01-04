import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ACTIVITY, DASHBOARD } from '../config/endpoints';
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

  
  currentPage = 0
  actvities =[]
  isLastpage
  loadMore = false

  isLoadActvity = false

  constructor(private dialog: MatDialog, private apiService: ApiService) { }

  ngOnInit() {
    this.fetchActivity()
    this.fetchGlobalActivity()
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

  fetchGlobalActivity() {
    if(!this.isLastpage){
      this.isLoadActvity = true
    let params = {offset: this.currentPage }
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
  showMore()
  {
    this.currentPage++
    this.fetchGlobalActivity()
  }
}
