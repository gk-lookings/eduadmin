import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { CLASSROOM_LIST, CREATE_POST, FILTER, FILTER_SUGGET, GET_TEMPLATE, HOST, TEMPLATE_LIST, USERS_LIST } from '../config/endpoints';
import { ApiService } from '../services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog, MatSnackBar } from '@angular/material';
import { UploadPictureComponent } from '../upload-picture/upload-picture.component';
import { Router } from '@angular/router';
import { WarningPopupComponent } from '../warning-popup/warning-popup.component';

import { DashboardComponent } from '../dashboard/dashboard.component';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  // createFields
  aboutBoard
  boardType = 'post'
  propertyType = 'true'

  author
  isLoadingProfPic = false
  profilePic
  profileUrl
  users = []
  txtUserChanged = new Subject<string>();
  userList = []



  // audience
  dropdownList = []
  selectedBoard = []

  selectedBoardSend = []

  departments = []
  semester = []
  grade = []
  class = []


  boardSelected = ''
  departmentSelected = ''
  classSelected = ''
  gradeSelected = ''
  semesterSelected = ''

  isLoadingTemp
  templates = []
  isLastpageTemp = false
  isEmptyTemp = false
  currentPageTemp = 0
  searchkeyTemp = ''
  txtTemplateChanged = new Subject<string>();
  templateSelected = []
  templateSelectedIds = []

  searchkeyClass = ''
  isLoadingClass = true
  classes = []
  isLastpageClass = false
  isEmptyClass = false
  currentPageClass = 0
  txtClassChanged = new Subject<string>();
  classroomSelected = []
  classroomSelectedIds = []

  isAdded = false

  filesList = []
  isLoadingPic = false

  responseMessage = ''
  success
  isLoadingPublish

  selectedAuthor

  externalLinkSet = []
  linkTitle
  linkUrl
  linkDescription

  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService, private dashboard: DashboardComponent,
    public dialog: MatDialog,
    public router: Router, private _snackBar: MatSnackBar
  ) {
    this.txtTemplateChanged.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(model => {
        this.searchkeyTemp = model;
        this.templates = []
        this.isLastpageTemp = false
        this.currentPageTemp = 0
        this.isLoadingTemp = false
        this.isEmptyTemp = false
        this.fetchTemplateList()
      });

    this.txtClassChanged.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(model => {
        this.searchkeyClass = model;
        this.classes = []
        this.isLastpageClass = false
        this.currentPageClass = 0
        this.isLoadingClass = false
        this.fetchClassList()
      });
  }

  ngOnInit() {
    this.dashboard.setPageTitle('Create Post');
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.getFIlterItems()
    this.fetchTemplateList()
    this.fetchClassList()
    this.getAuthors()
  }

  getAuthors() {
    this.users = []
    this.userList = []
    let params = { term: '', offset: 0, count: 100 }
    this.apiService.getResponse('get', USERS_LIST, params).
      then(res => {
        if (res.status === 200) {
          if (this.propertyType == 'true') {
            for (let i = 0; i < res.data.users.length; i++) {
              if (res.data.users[i].role == "PROMOTER") {
                this.users.push(res.data.users[i])
                this.userList.push(res.data.users[i])
              }
            }
          }
          else {
            this.users = res.data.users
            this.userList = res.data.users
          }
        }
      })
  }

  authorSet(item) {
    this.selectedAuthor = item.firstName + ' ' + item.lastName
  }


  onKey(query) {
    this.users = this.search(query)
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.userList.filter(option => option.firstName.toLowerCase().startsWith(filter));
  }

  addPictures() {
    let open = this.dialog.open(UploadPictureComponent).afterClosed().subscribe(res => {
      let newArray = []
      var fileArray = []
      var re = /(?:\.([^.]+))?$/;
      if (res) {
        this.isLoadingPic = true
        for (let i = 0; i < res.length; i++) {
          const formData = new FormData();
          formData.append('file', res[i]);
          let elem = this.apiService.getResponse('post', HOST + 'misc/s3-upload?path=admin-post/' + res[i].lastModified + '.' + re.exec(res[i].name)[1], formData)
          fileArray.push(elem)
        }
        Promise.all(fileArray).then(result => {
          this.isLoadingPic = false
          for (let m = 0; m < res.length; m++) {
            for (let n = m; n < result.length; n++) {
              let item = {
                "name": res[m].name,
                "size": res[m].size,
                "type": res[m].type,
                "url": result[n].data.imageURL,
                "createdAt": new Date()
              }
              if (m == n)
                newArray.push(item)
            }
          }
          this.filesList = this.filesList.concat(newArray)
        }).catch(err => {
          console.log("error", err);
        })
      }
    })
  }


  addLink() {
    let item = {
      title: this.linkTitle,
      url: this.linkUrl,
      description: this.linkDescription
    }
    if (this.linkUrl)
      this.externalLinkSet.push(item)
  }

  removeLink(item) {
    let index = this.externalLinkSet.indexOf(item)
    this.externalLinkSet.splice(index, 1)
  }

  getFIlterItems() {
    let params = {}
    this.apiService.getResponse('get', FILTER, params).
      then(res => {
        if (res.status === 200) {
          this.dropdownList = res.data.filters
        }
      })
  }

  selectBoard(item) {
    this.departmentSelected = ''
    this.classSelected = ''
    this.semesterSelected = ''
    this.gradeSelected = ''

    let params = { term: item.board, offset: 0, count: 10 }
    this.apiService.getResponse('get', FILTER + '/suggest', params).
      then(res => {
        if (res.status === 200) {
          this.departments = res.data.filters[0].department
          this.semester = res.data.filters[0].semester
          this.grade = res.data.filters[0].grade
          this.class = res.data.filters[0].class
        }
      })
  }
  selectDepartment(item) {
    this.departmentSelected = item

  }
  selectClass(item) {
    this.classSelected = item

  }
  selectSemester(item) {
    this.semesterSelected = item

  }
  selectGrade(item) {
    this.gradeSelected = item
  }

  addItem() {
    let item = {
      board: this.boardSelected,
      department: this.departmentSelected,
      class: this.classSelected,
      semester: this.semesterSelected,
      grade: this.gradeSelected
    }
    let send = {
      board: this.boardSelected == 'all' ? '' : this.boardSelected,
      department: this.departmentSelected == 'all' ? '' : this.departmentSelected,
      class: this.classSelected == 'all' ? '' : this.classSelected,
      semester: this.semesterSelected == 'all' ? '' : this.semesterSelected,
      grade: this.gradeSelected == 'all' ? '' : this.gradeSelected,
    }

    this.selectedBoard.push(item)
    this.selectedBoardSend.push(send)
  }

  containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        return true;
      }
    }
    return false;
  }

  removeItem(item) {
    let index = this.selectedBoard.indexOf(item)
    this.selectedBoard.splice(index, 1)
    this.selectedBoardSend.splice(index, 1)
  }

  fetchTemplateList() {
    this.isEmptyTemp = false
    if (!this.isLastpageTemp) {
      this.isLoadingTemp = true;
      let params = { term: this.searchkeyTemp, offset: this.currentPageTemp, count: 7 }
      this.apiService.getResponse('get', TEMPLATE_LIST, params).
        then(res => {
          this.isLoadingTemp = false;
          if (res.status === 200) {
            this.templates = this.templates.concat(res.data.templates)
            this.isLastpageTemp = (res.data.templates.length == 0) ? true : false
            if (this.templates.length == 0)
              this.isEmptyTemp = true
          }
        })
    }
  }

  scrollMeTemp(event) {
    if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight)) {
      if (!this.isLastpageTemp) {
        this.currentPageTemp++
        this.fetchTemplateList()
      }
    }
  }

  searchTempResults(query: string) {
    this.txtTemplateChanged.next(query);
  }

  addTemplate(item, i) {
    if (!this.templateSelected.includes(item)) {
      this.templateSelected.push(item)
      this.templateSelectedIds.push(item._id);
      (<HTMLInputElement>document.getElementById("item" + i)).innerHTML = 'ADDED';
      (<HTMLInputElement>document.getElementById("item" + i)).classList.add('addedCss')
    }
  }

  removeTemplate(item) {
    let i
    let index = this.templateSelected.indexOf(item)
    this.templateSelected.splice(index, 1)
    this.templateSelectedIds.splice(this.templateSelected.indexOf(item._id), 1)
    for (let m = 0; m < this.templates.length; m++) {
      if (this.templates[m] == item) {
        (<HTMLInputElement>document.getElementById("item" + m)).innerHTML = 'ADD';
        (<HTMLInputElement>document.getElementById("item" + m)).classList.remove('addedCss')
      }
    }
  }

  fetchClassList() {
    if (!this.isLastpageClass) {
      this.isLoadingClass = true;
      this.isEmptyClass = false
      let params = { term: this.searchkeyClass, offset: this.currentPageClass, count: 6 }
      this.apiService.getResponse('get', CLASSROOM_LIST, params).
        then(res => {
          this.isLoadingClass = false;
          if (res.status === 200) {
            this.classes = this.classes.concat(res.data.classRooms)
            this.isLastpageClass = (res.data.classRooms.length == 0) ? true : false
            if (this.classes.length == 0)
              this.isEmptyClass = true
          }
        })
    }
  }

  searchClassResults(query: string) {
    this.txtClassChanged.next(query);
  }

  scrollMeClass(event) {
    if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight)) {
      if (!this.isLastpageClass) {
        this.currentPageClass++
        this.fetchClassList()
      }
    }
  }

  addClassRoom(item, i) {
    if (!this.classroomSelected.includes(item)) {
      this.classroomSelected.push(item)
      this.classroomSelectedIds.push(item._id);
      (<HTMLInputElement>document.getElementById("itemClass" + i)).innerHTML = 'ADDED';
      (<HTMLInputElement>document.getElementById("itemClass" + i)).classList.add('addedCss')
    }

  }

  removeClass(item) {
    let index = this.classroomSelected.indexOf(item)
    this.classroomSelected.splice(index, 1)
    this.classroomSelectedIds.splice(this.classroomSelected.indexOf(item._id), 1)
    for (let m = 0; m < this.classes.length; m++) {
      if (this.classes[m] == item) {
        (<HTMLInputElement>document.getElementById("itemClass" + m)).innerHTML = 'ADD';
        (<HTMLInputElement>document.getElementById("itemClass" + m)).classList.remove('addedCss')
      }
    }
  }

  publish() {
    this.responseMessage = ''
    if (this.selectedBoardSend.length == 0 && this.templateSelectedIds.length == 0 && this.classroomSelectedIds.length == 0) {
      this.responseMessage = 'Please select atleast board/university, classroom or template'
    }
    else if (!this.author) {
      this.responseMessage = 'Please select author.!'
    }

    else if (!this.aboutBoard) {
      this.responseMessage = 'Please add about section.!'
    }

    else {
      this.responseMessage = ''
      this.isLoadingPublish = true
      let params = {
        "templateIds": this.templateSelectedIds,
        "classRoomIds": this.classroomSelectedIds,
        "data": {
          "content": this.aboutBoard,
          "documents": this.filesList,
          'externalInfo': this.externalLinkSet,
        },

        "filters": this.selectedBoardSend,
        "notifyUsers": true,
        "isSponsored": this.propertyType,
        "boardType": this.boardType,
        "promoterId": this.author
      }
      this.apiService.getResponse('post', CREATE_POST, params).
        then(res => {
          if (res.status === 200) {
            this.isLoadingPublish = false
            this.success = true
            let snackBarRef = this._snackBar.open('Post has been published succefully.!', '', { duration: 2500, panelClass: 'snackbar' });
            setTimeout(() => {
              this.responseMessage = ''
              this.reloadComponent()
            }, 500);
            this.templateSelectedIds = []
            this.classroomSelectedIds = []
            this.classroomSelected = []
            this.templateSelected = []
            this.aboutBoard = ''
            this.selectedBoard = []
            this.filesList = []

            this.searchkeyTemp = '';
            this.templates = []
            this.isLastpageTemp = false
            this.currentPageTemp = 0
            this.isLoadingTemp = false
            this.isEmptyTemp = false
            this.fetchTemplateList()

            this.searchkeyClass = '';
            this.classes = []
            this.isLastpageClass = false
            this.currentPageClass = 0
            this.isLoadingClass = false
            this.fetchClassList()
          }
          else {
            let snackBarRef = this._snackBar.open(res.error.data, '', { duration: 2000, panelClass: 'snackbar' });
          }
        })
    }
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  uploadProfPic(event) {
    if (event[0].type.indexOf("image") != -1) {
      this.isLoadingProfPic = true
      var re = /(?:\.([^.]+))?$/;
      const formData = new FormData();
      formData.append('file', event[0]);
      this.apiService.getResponse('post', HOST + 'misc/s3-upload?path=admin-post/logo/' + event[0].lastModified + '.' + re.exec(event[0].name)[1], formData).
        then(res => {
          this.profileUrl = res.data.imageURL
          this.isLoadingProfPic = false
          this.profilePic = {
            "name": event[0].name,
            "size": event[0].size,
            "type": event[0].type,
            "url": res.data.imageURL,
            "createdAt": new Date()
          }
        })
    }
    else {
      let open = this.dialog.open(WarningPopupComponent, { data: 'Only "image" files are allowed.' })
    }
  }
}