import { Component, OnInit } from '@angular/core';
import { ApiService } from './../services';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from './../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FILTER, GET_TEMPLATE, HOST, LOGIN, SUBJECT, TEMPLATE_CREATE, TEMPLATE_LIST } from '../config/endpoints';
import { Location } from '@angular/common';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { NgxSpinnerService } from 'ngx-spinner';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatDialog } from '@angular/material';
import { FilterAddModelComponent } from '../filter-add-model/filter-add-model.component';
import { WarningPopupComponent } from '../warning-popup/warning-popup.component';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.css']
})
export class EditTemplateComponent implements OnInit {

  tempId: string;
  tempName: string;
  responseMessage: string;
  isLoading: boolean;
  success: boolean;

  // tempIdControl = new FormControl('', [Validators.required]);
  tempNameFormControl = new FormControl('', Validators.required);
  boardFormControl = new FormControl('', Validators.required);

  createTemplateForm: FormGroup = new FormGroup({
    // tempId: this.tempIdControl,
    tempName: this.tempNameFormControl,
    board:this.boardFormControl
  });

  files: any[] = [];

  __tempId = this.activatedRoute.snapshot.params['tempId'];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags = [];
  logo

  isLoadingTotal
  
  dropdownList = [];
  selectedItems=[];
  dropdownSettings: IDropdownSettings = {};
  filterId
  board


  isDepartment
  isClass
  isSemester
  isGrade



  departments = [];
  departmentArray=''
  departIndex

  classes = [];
  classArray = ''
  classIndex

  semesters = [];
  semesterArray = ''
  semesterIndex

  grades = [];
  gradesArray =''
  gradeIndex

  selectedIndexs = []

  currentFilter

  constructor(private apiService: ApiService, public _location: Location, private router: Router, private spinner: NgxSpinnerService, private authService: AuthenticationService, private http: HttpClient, private activatedRoute: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit() {
    this.getFIlterItems()
    this.getDetail()
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'board',
      textField: 'board',
      defaultOpen: false,
      allowSearchFilter: false
    };   

  }

  createBoard(){
    const open = this.dialog.open(FilterAddModelComponent, { data: 'Board/University', disableClose: true }).afterClosed().subscribe(result => {
      if (result)
        {
          let params = {
            "board": result,
          }
          this.apiService.getResponse('post', FILTER, params).
            then(res => {
              if (res.status === 200) {
                this.getFIlterItems()
              }
            })
        }
      
    })
  }

  // createArray(type, obj, i) {
  //   if (type == 'department') {
  //     if (!this.departmentArray.includes(obj)) {
  //       this.departmentArray.push(obj);
  //       (<HTMLInputElement>document.getElementById("departmentId_" + i)).classList.add('add')
  //     }
  //     else {
  //       let index = this.departmentArray.findIndex(element => element == obj)
  //       this.departmentArray.splice(index, 1);
  //       (<HTMLInputElement>document.getElementById("departmentId_" + i)).classList.remove('add')
  //     }
  //   }
  //   if (type == 'class') {
  //     if (!this.classArray.includes(obj)) {
  //       this.classArray.push(obj);
  //       (<HTMLInputElement>document.getElementById("classId_" + i)).classList.add('add')
  //     }
  //     else {
  //       let index = this.classArray.findIndex(element => element == obj);
  //       this.classArray.splice(index, 1);
  //       (<HTMLInputElement>document.getElementById("classId_" + i)).classList.remove('add')
  //     }
  //   }
  //   if (type == 'semester') {
  //     if (!this.semesterArray.includes(obj)) {
  //       this.semesterArray.push(obj);
  //       (<HTMLInputElement>document.getElementById("semesterId_" + i)).classList.add('add')
  //     }
  //     else {
  //       let index = this.semesterArray.findIndex(element => element == obj)
  //       this.semesterArray.splice(index, 1);
  //       (<HTMLInputElement>document.getElementById("semesterId_" + i)).classList.remove('add')
  //     }
  //   }
  //   if (type == 'grades') {
  //     if (!this.gradesArray.includes(obj)) {
  //       this.gradesArray.push(obj);
  //       (<HTMLInputElement>document.getElementById("gradeId_" + i)).classList.add('add')
  //     }
  //     else {
  //       let index = this.gradesArray.findIndex(element => element == obj);
  //       this.gradesArray.splice(index, 1);
  //       (<HTMLInputElement>document.getElementById("gradeId_" + i)).classList.remove('add')
  //     }
  //   }
  // }

  addFilterElement(type) {
    if (type == 'department') {
      const open = this.dialog.open(FilterAddModelComponent, { data: type, disableClose: true }).afterClosed().subscribe(result => {
        if (result)
          {
            this.departments.push(result)
            let params = {
              department : this.departments,
            }
            this.apiService.getResponse('put', FILTER+'/'+this.filterId, params).
              then(res => {
                if (res.status === 200) {
                  this.getFIlterItems()
                }
              })
          }
      })
    }
    if (type == 'class') {
      const open = this.dialog.open(FilterAddModelComponent, { data: type, disableClose: true }).afterClosed().subscribe(result => {
        if (result)
          {
            this.classes.push(result)
            let params = {
              class : this.classes,
            }
            this.apiService.getResponse('put', FILTER+'/'+this.filterId, params).
              then(res => {
                if (res.status === 200) {
                  this.getFIlterItems()
                }
              })
          }
      })
    }
    if (type == 'semester') {
      const open = this.dialog.open(FilterAddModelComponent, { data: type, disableClose: true }).afterClosed().subscribe(result => {
        if (result)
          {
            this.semesters.push(result)
            let params = {
              semester : this.semesters,
            }
            this.apiService.getResponse('put', FILTER+'/'+this.filterId, params).
              then(res => {
                if (res.status === 200) {
                  this.getFIlterItems()
                }
              })
          }
      })
    }
    if (type == 'grade') {
      const open = this.dialog.open(FilterAddModelComponent, { data: type, disableClose: true }).afterClosed().subscribe(result => {
        if (result)
          {
            this.grades.push(result)
            let params = {
              grade : this.grades,
            }
            this.apiService.getResponse('put', FILTER+'/'+this.filterId, params).
              then(res => {
                if (res.status === 200) {
                  this.getFIlterItems()
                }
              })
          }
      })
    }
  }

  getFIlterItems(){
    let params = {}
    this.apiService.getResponse('get', FILTER, params).
      then(res => {
        if (res.status === 200) {
        this.dropdownList = res.data.filters
        }
      })
  }

  onItemSelect(item: any) {
    
    this.filterId = item.id
    this.board = item.board
    for (let i = 0; i < this.dropdownList.length; i++) {
      let element = this.dropdownList[i];
      if(this.dropdownList[i].id == item.id)
      {      
        this.departments = this.dropdownList[i].department
        this.classes = this.dropdownList[i].class;
        this.semesters = this.dropdownList[i].semester;
        this.grades = this.dropdownList[i].grade
      }
    }    

  }

  getDetail() {
    let params = {}
    this.spinner.show();
    this.isLoadingTotal = true
    this.apiService.getResponse('get', GET_TEMPLATE + this.__tempId, params).
      then(res => {
        this.spinner.hide();        
        if (res.status === 200) {
          this.isLoadingTotal = false
          this.tempName = res.data.name
          this.tempId = res.data.templateId
          this.tags = res.data.descriptionTags
          this.logo = res.data.logo
          this.selectedItems = res.data.filters.board
          this.departmentArray = res.data.filters.department
          this.semesterArray = res.data.filters.semester
          this.classArray = res.data.filters.class
          this.gradesArray = res.data.filters.grade
          this.currentFilter =  res.data.filters
          this.onItemSelect({id : res.data.filters.filterId, board : res.data.filters.board})
          
        }
      })
  }

  submitForm() {
    this.isLoading = true
    var image
    var re = /(?:\.([^.]+))?$/;
    if (this.files.length != 0) {
      const formData = new FormData();
      formData.append('file', this.files[0]);
      this.apiService.getResponse('post', HOST + 'misc/s3-upload?path=template/template/logo/' + this.tempId + '.' + re.exec(this.files[0].name)[1], formData).then(res => {
        image = res.data.imageURL
        if (res.status === 200) {
          let params = {
            "templateId": this.tempId,
            "name": this.tempName,
            "descriptionTags": this.tags,
            "logo": image,
            "filters" : {
              "board": this.board,
              "department": this.departmentArray,
              "semester": this.semesterArray,
              "grade": this.gradesArray,
              "class": this.classArray,
              'filterId':this.filterId
            }
          }
          this.apiService.getResponse('put', GET_TEMPLATE + this.__tempId, params).
            then(res => {
              this.isLoading = false;
              if (res.status === 200) {
                this.success = true
                this.responseMessage = 'Template has been updated succefully..!'
                setTimeout(() => {
                  this.responseMessage = ''
                }, 3000);
                this.files = []
                this.apiService.getResponse('get', GET_TEMPLATE + this.__tempId, {}).
                  then(res => {
                    this.spinner.hide();
                    if (res.status === 200) {
                      this.tempName = res.data.name
                      this.tempId = res.data.templateId
                      this.tags = res.data.descriptionTags
                      this.logo = res.data.logo
                    }
                  })
              }
              else {
                this.responseMessage = res.error.data
              }
            })
        }
      }).catch(err => {
        this.isLoading = false
        console.log("error", err);
      })
    }
    else {
      let params = {
        "templateId": this.tempId,
        "name": this.tempName,
        "descriptionTags": this.tags,
        "filters" : {
          "board": this.board,
          "department": this.departmentArray,
          "semester": this.semesterArray,
          "grade": this.gradesArray,
          "class": this.classArray,
          'filterId':this.filterId
        }
      }
      this.apiService.getResponse('put', GET_TEMPLATE + this.__tempId, params).
        then(res => {
          this.isLoading = false;
          if (res.status === 200) {
            this.success = true
            this.responseMessage = 'Template has been updated succefully..!'
            setTimeout(() => {
              this.responseMessage = ''
              this._location.back()
            }, 2000);
          }
          else {
            this.responseMessage = res.error.data
          }
        })
    }
  }



  getNameErrorMessage() {
    return this.tempNameFormControl.hasError('required') ? '*You must enter a value' :
      '';
  }

  // getIDErrorMessage() {
  //   return this.tempIdControl.hasError('required') ? '*You must enter a value' :
  //     '';
  // }


  getBoardErrorMessage() {
    return this.boardFormControl.hasError('required') ? '*You must select an option' :
      '';
  }

  onFileDropped($event) {
    if ($event[0].type.indexOf("image") != -1) {
      this.files = []
      this.prepareFilesList($event);
    }
    else {
      let open = this.dialog.open(WarningPopupComponent, { data: 'Only "image" files are allowed.' })
    }

  }

  fileBrowseHandler(files) {
    if (files[0].type.indexOf("image") != -1) {
      this.files = []
      this.prepareFilesList(files);
    }
    else {
      let open = this.dialog.open(WarningPopupComponent, { data: 'Only "image" files are allowed.' })
    }
  }

  deleteFile(index: number) {
    this.files = []
  } 

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files = files;
    }
    this.uploadFilesSimulator(0);
  }

  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  remove(tag): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
  setRow(type, obj){
    // if (type == 'department') {
    //   this.departmentArray = obj
    // }
    // if (type == 'class') {
    //   this.classArray = obj
    // }
    // if (type == 'semester') {
    //   this.semesterArray = obj
    // }
    // if (type == 'grade') {
    //   this.gradesArray = obj
    // }
  }

  departmentSelect(){
    if(this.isDepartment)
    {
      this.isDepartment= false
      this.departIndex = -1
      this.departmentArray = ''
    }
    else{
      this.isDepartment=true
    }
  }
  classSelect(){
    if(this.isClass)
    {
      this.isClass = false
      this.classIndex = -1
      this.classArray =''
    }
    else
    this.isClass = true
  }

  semesterSelect(){
    if(this.isSemester)
    {
      this.isSemester = false
      this.semesterIndex = -1 
      this.semesterArray = ''
    }
    else
      this.isSemester = true
  }
  gradeSelect(){
    if(this.isGrade)
    {
      this.isGrade = false
      this.gradeIndex = -1
      this.gradesArray  =''
    }
    else
    this.isGrade  = true
  }

}