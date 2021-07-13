import { Component, Input, OnInit } from '@angular/core';
import { USERS_LIST, USER_ACTIVATE, USER_DEACTIVATE, USER_DETAILS } from '../config/endpoints';
import { ApiService } from '../services';

@Component({
  selector: 'app-user-single',
  templateUrl: './user-single.component.html',
  styleUrls: ['./user-single.component.css']
})
export class UserSingleComponent implements OnInit {
  @Input() item
  @Input() last
  isActive

  popoverTitle = 'Are you sure?';
  popoverMessage = 'Are you really want to do this?';
  confirmClicked = false;
  cancelClicked = false;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.isActive = this.item && this.item.active
    console.log("last", this.last);
    
  }

  deactivate(id)
  {
    if (this.isActive) {
      let params = { userId: id }
      this.apiService.getResponse('get', USER_DEACTIVATE, params).
        then(res => {
          if (res.status === 200) {
            this.isActive = !this.isActive
          }
        })
    }
    else {
      this.apiService.getResponse('get', USER_DETAILS +'/'+ id +'/activate' ,).
        then(res => {
          if (res.status === 200) {
            this.isActive = !this.isActive
          }
        })
    }
  }
}