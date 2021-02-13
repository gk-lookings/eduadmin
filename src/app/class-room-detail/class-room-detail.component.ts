import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CLASSROOM, GET_TEMPLATE } from '../config/endpoints';
import { ApiService } from '../services';

@Component({
  selector: 'app-class-room-detail',
  templateUrl: './class-room-detail.component.html',
  styleUrls: ['./class-room-detail.component.css']
})
export class ClassRoomDetailComponent implements OnInit {
  class
  isLoading

  isActive
  popoverTitle = 'Are you sure?';
  popoverMessage = 'Are you really want to do this ?';
  confirmClicked = false;
  cancelClicked = false;

  classId = this.activatedRoute.snapshot.params['classId'];
  classMeta

  template

  constructor(private apiService: ApiService, public _location: Location, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.fetchCalss()
    this.fetchMeta()
  }
  fetchCalss() {
    this.isLoading = true;
    let params = {}
    this.apiService.getResponse('get', CLASSROOM + this.classId, params).
      then(res => {
        this.isLoading = false;
        if (res.status === 200) {
          this.class = res.data
          if(res.data.templateId)
          this.fetchTemplate(res.data.templateId)
          this.isActive  = res.data.active
        }
      })
  }
  deactivate() {
    let params = { 'active': !this.isActive }
    this.apiService.getResponse('put', CLASSROOM + this.classId, params).
      then(res => {
        if (res.status === 200) {
          this.isActive = !this.isActive
        }
      })
  }

  fetchMeta() {
    let params = {}
    this.apiService.getResponse('get', CLASSROOM + this.classId +'/stats', params).
      then(res => {
        if (res.status === 200) {
          this.classMeta = res.data
        }
      })
  }


  fetchTemplate(id){
    let params = {}
    this.apiService.getResponse('get', GET_TEMPLATE + id, params).
      then(res => {
        if (res.status === 200) {
          this.template = res.data
        }
      })
  }

}
