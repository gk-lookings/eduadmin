import { Component, Input, OnInit } from '@angular/core';
import { USERS_LIST } from '../config/endpoints';
import { ApiService } from '../services';

@Component({
  selector: 'app-user-single',
  templateUrl: './user-single.component.html',
  styleUrls: ['./user-single.component.css']
})
export class UserSingleComponent implements OnInit {
  @Input() item
  isActive

  popoverTitle = 'Are you sure?';
  popoverMessage = 'Are you really want to do this?';
  confirmClicked = false;
  cancelClicked = false;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.isActive = this.item && this.item.active
  }

  deactivate(id)
  {
    let params = { 'active' : !this.isActive }
    this.apiService.getResponse('put', USERS_LIST + id, params).
      then(res => {
        if (res.status === 200) {
          this.isActive = !this.isActive
        }
      })
  }
}