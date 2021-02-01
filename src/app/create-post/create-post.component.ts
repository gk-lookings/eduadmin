import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Subject } from 'rxjs';
import { CLASSROOM_LIST, FILTER, TEMPLATE_LIST } from '../config/endpoints';
import { ApiService } from '../services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { UploadPictureComponent } from '../upload-picture/upload-picture.component';

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
  boardType='sponsered'

  // audience
  dropdownList=[]
  selectedBoard=[]

  departments=[]
  semester=[]
  grade=[]
  class=[]

  
  boardSelected=''
  departmentSelected=''
  classSelected=''
  gradeSelected=''
  semesterSelected=''

  isLoadingTemp
  templates =[]
  isLastpageTemp = false
  isEmptyTemp = false
  currentPageTemp = 0
  searchkeyTemp=''
  txtTemplateChanged = new Subject<string>();
  templateSelected=[]

  searchkeyClass=''
  isLoadingClass = true
  classes = []
  isLastpageClass = false
  isEmptyClass = false
  currentPageClass = 0
  txtClassChanged = new Subject<string>();
  classroomSelected=[]

  constructor(
    private _formBuilder: FormBuilder,
    private apiService: ApiService,
    public dialog : MatDialog
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
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.getFIlterItems()
    this.fetchTemplateList()
    this.fetchClassList()
  }

  addPictures(){
    let open =this.dialog.open(UploadPictureComponent).afterClosed().subscribe(res => {
      if (res)
      {
        console.log("files", res);
        
      }
    })
  }

  getFIlterItems(){
    let params = {}
    this.apiService.getResponse('get', FILTER, params).
      then(res => {
        if (res.status === 200) {
        console.log("resulrt  filt", res);
        this.dropdownList = res.data.filters
        }
      })
  }
  selectBoard(item){
    this.departments = item.department
    this.semester = item.semester
    this.grade = item.grade
    this.class = item.class
    this.boardSelected = item.board
    this.departmentSelected =''
    this.classSelected = ''
    this.semesterSelected = ''
    this.gradeSelected = ''
  }
  selectDepartment(item){
    this.departmentSelected = item
  }
  selectClass(item){
    this.classSelected = item
  }
  selectSemester(item){
    this.semesterSelected = item
  }
  selectGrade(item){
    this.gradeSelected = item
  }

  addItem()
  {
    
    const item = {
      board: this.boardSelected,
      department: this.departmentSelected,
      class: this.classSelected,
      semester: this.semesterSelected,
      grade: this.gradeSelected
    }
    this.selectedBoard.push(item)
  }
  removeItem(item){
    let index = this.selectedBoard.indexOf(item)
    this.selectedBoard.splice(index, 1)
  }
  fetchTemplateList() {
    this.isEmptyTemp = false
    if (!this.isLastpageTemp) {
      this.isLoadingTemp = true;
      let params = { term: this.searchkeyTemp, offset: this.currentPageTemp, count : 7 }
      this.apiService.getResponse('get', TEMPLATE_LIST, params).
        then(res => {
          this.isLoadingTemp = false;
          if (res.status === 200) {
            this.templates = this.templates.concat(res.data.templates)
            this.isLastpageTemp = (res.data.templates.length == 0) ? true : false
            if(this.templates.length == 0)
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

  searchTempResults(query:string) {
    this.txtTemplateChanged.next(query);
  }
 

  addTemplate(item){
    if(!this.templateSelected.includes(item))
    this.templateSelected.push(item)
  }
  removeTemplate(item){
    let index = this.templateSelected.indexOf(item)
    this.templateSelected.splice(index, 1)
  }

  fetchClassList() {
    if (!this.isLastpageClass) {
      this.isLoadingClass = true;
      this.isEmptyClass = false
      let params = { term: this.searchkeyClass, offset: this.currentPageClass, count : 6 }
      this.apiService.getResponse('get', CLASSROOM_LIST, params).
        then(res => {
          this.isLoadingClass = false;
          if (res.status === 200) {
            this.classes = this.classes.concat(res.data.classRooms)
            this.isLastpageClass = (res.data.classRooms.length == 0) ? true : false
            if(this.classes.length == 0)
            this.isEmptyClass = true
          }
        })
    }
  }
  searchClassResults(query:string) {
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

  addClassRoom(item){
    if(!this.classroomSelected.includes(item))
    this.classroomSelected.push(item)
  }
  removeClass(item){
    let index = this.classroomSelected.indexOf(item)
    this.classroomSelected.splice(index, 1)
  }
}

