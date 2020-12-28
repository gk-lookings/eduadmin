import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CLASSROOM } from '../config/endpoints';
import { ApiService } from '../services';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user
  isLoading

  isActive
  popoverTitle = 'Are you sure?';
  popoverMessage = 'Are you really want to do this ?';
  confirmClicked = false;
  cancelClicked = false;

  userId = this.activatedRoute.snapshot.params['userId'];

  constructor(private apiService: ApiService, public _location: Location, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }
  fetchCalss() {
    this.isLoading = true;
    let params = {}
    this.apiService.getResponse('get', CLASSROOM + this.userId, params).
      then(res => {
        this.isLoading = false;
        console.log("res", res);
        if (res.status === 200) {
          this.user = res.data
          this.isActive  = res.data.active
        }
      })
  }
  deactivate() {
    let params = { 'active': !this.isActive }
    this.apiService.getResponse('put', CLASSROOM + this.userId, params).
      then(res => {
        if (res.status === 200) {
          this.isActive = !this.isActive
        }
      })
  }

}
