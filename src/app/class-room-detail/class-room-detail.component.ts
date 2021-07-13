import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CLASSROOM, GET_TEMPLATE, USER_DETAILS } from '../config/endpoints';
import { ApiService } from '../services';
import { DashboardComponent } from '../dashboard/dashboard.component';
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

  userIdList =[]
  userList=[]
  userSet =[]
  constructor(private apiService: ApiService,public _location: Location, private activatedRoute: ActivatedRoute, private dashboard : DashboardComponent) { }

  ngOnInit() {
    this.fetchCalss()
    this.fetchMeta()
    this.dashboard.setPageTitle('Classroom');
  }
  fetchCalss() {
    this.isLoading = true;
    let params = {}
    this.apiService.getResponse('get', CLASSROOM + this.classId, params).
      then(res => {
        this.isLoading = false;
        if (res.status === 200) {
          this.class = res.data
          this.userSet = res.data.members
          for (let i = 0; i < res.data.members.length; i++) {
            let element = res.data.members[i].userId;
            this.userIdList.push(element.toString())
          }
          if(res.data.templateId)
          this.fetchTemplate(res.data.templateId)
          this.isActive  = res.data.active
          this.fetchUserDetails(this.userIdList)
          
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



  fetchUserDetails(id)
  {
    this.apiService.getResponse('post', USER_DETAILS+'/list', id).
      then(res => {
        if (res.status === 200) {
          for (let m = 0; m < res.data.length; m++) {
            for (let n = m; n < this.userSet.length; n++) {
              if(m==n) {
                this.userList.push({
                  active: res.data[m].active,
                  email: res.data[m].email,
                  firstName: res.data[m].firstName,
                  lastName: res.data[m].lastName,
                  _id: res.data[m]._id,
                  role:this.userSet[n].role
              })
            }
          }
          }



        }
      })
  }

}
