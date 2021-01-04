import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './../services';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from './../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FILTER, HOST, SUBJECT, TEMPLATE_CREATE, TEMPLATE_LIST } from '../config/endpoints';

import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatDialog } from '@angular/material';
import { FilterAddModelComponent } from '../filter-add-model/filter-add-model.component';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.css']
})
export class CreateTemplateComponent implements OnInit {

  tempId: string;
  tempName: string;
  responseMessage: string;
  isLoading: boolean;
  success: boolean;
  tempIdControl = new FormControl('', [Validators.required]);
  tempNameFormControl = new FormControl('', Validators.required);
  boardFormControl = new FormControl('', Validators.required);

  createTemplateForm: FormGroup = new FormGroup({
    tempId: this.tempIdControl,
    tempName: this.tempNameFormControl,
    board:this.boardFormControl
  });

  files: any[] = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags = [];

  subjects: any[] = [];

  categorys = [];
  subSelected = [];

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
  departmentArray = []

  classes = [];
  classArray = []

  semesters = [];
  semesterArray = []

  grades = [];
  gradesArray = []

  selectedIndexs = []

  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit() {
    // this.getSubjects();
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'board',
      defaultOpen: false,
      allowSearchFilter: false
    };

    this.getFIlterItems()
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

  createArray(type, obj, i) {
    if (type == 'department') {
      if (!this.departmentArray.includes(obj)) {
        this.departmentArray.push(obj);
        (<HTMLInputElement>document.getElementById("departmentId_" + i)).classList.add('add')
      }
      else {
        let index = this.departmentArray.findIndex(element => element == obj)
        this.departmentArray.splice(index, 1);
        (<HTMLInputElement>document.getElementById("departmentId_" + i)).classList.remove('add')
      }
    }
    if (type == 'class') {
      if (!this.classArray.includes(obj)) {
        this.classArray.push(obj);
        (<HTMLInputElement>document.getElementById("classId_" + i)).classList.add('add')
      }
      else {
        let index = this.classArray.findIndex(element => element == obj);
        this.classArray.splice(index, 1);
        (<HTMLInputElement>document.getElementById("classId_" + i)).classList.remove('add')
      }
    }
    if (type == 'semester') {
      if (!this.semesterArray.includes(obj)) {
        this.semesterArray.push(obj);
        (<HTMLInputElement>document.getElementById("semesterId_" + i)).classList.add('add')
      }
      else {
        let index = this.semesterArray.findIndex(element => element == obj)
        this.semesterArray.splice(index, 1);
        (<HTMLInputElement>document.getElementById("semesterId_" + i)).classList.remove('add')
      }
    }
    if (type == 'grades') {
      if (!this.gradesArray.includes(obj)) {
        this.gradesArray.push(obj);
        (<HTMLInputElement>document.getElementById("gradeId_" + i)).classList.add('add')
      }
      else {
        let index = this.gradesArray.findIndex(element => element == obj);
        this.gradesArray.splice(index, 1);
        (<HTMLInputElement>document.getElementById("gradeId_" + i)).classList.remove('add')
      }
    }
  }

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
        console.log("resulrt  filt", res);
        this.dropdownList = res.data.filters
        }
      })
  }

  onItemSelect(item: any) {
    console.log(item);
    this.filterId = item.id
    this.board = item.board
    for (let i = 0; i < this.dropdownList.length; i++) {
      const element = this.dropdownList[i];
      if(element.id == item.id)
      {
        this.departments = this.dropdownList[i].department
        this.classes = this.dropdownList[i].class;
        this.semesters = this.dropdownList[i].semester;
        this.grades = this.dropdownList[i].grade
      }
    }    

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
              "department": JSON.stringify(this.departmentArray),
              "semester": JSON.stringify(this.semesterArray),
              "grade": JSON.stringify(this.gradesArray),
              "class": JSON.stringify(this.classArray),
            }
          }
          this.apiService.getResponse('post', TEMPLATE_CREATE, params).
            then(res => {
              this.isLoading = false;
              if (res.status === 200) {
                this.success = true
                this.responseMessage = 'Template created succefully..!'
                setTimeout(() => {
                  this.responseMessage = ''
                }, 3000);
                this.tags = []
                this.files = []
                this.createTemplateForm.reset();
              }
              else {
                this.responseMessage = res.error.message
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
          "department": JSON.stringify(this.departmentArray),
          "semester": JSON.stringify(this.semesterArray),
          "grade": JSON.stringify(this.gradesArray),
          "class": JSON.stringify(this.classArray),
        }
      }
      this.apiService.getResponse('post', TEMPLATE_CREATE, params).
        then(res => {
          this.isLoading = false;
          if (res.status === 200) {
            this.success = true
            this.responseMessage = 'Template created succefully..!'
            setTimeout(() => {
              this.responseMessage = ''
            }, 3000);
            this.tags = []
            this.files = []
            this.selectedItems= []
            this.createTemplateForm.reset();
          }
          else {
            this.responseMessage = res.error.message
          }
        })
    }


    /*
    {
      "templateId": "5f7f3e9ee45368b9b5794548",
      "name": "my template",
      "descriptionTags": [
        "chemistry",
        "bTech"
      ],
      "active": true,
      "about": "string",
      "subjects": [
        {
          "subjectId": "5f8057b5ab27d80017fdd2f1",
          "sections": [
            {
              "title": "module 1",
              "description": "module 1 descrption"
            }
          ]
        }
      ],
      "documents": [
        {
          "title": "document title",
          "files": [
            {
              "name": "string",
              "size": 0,
              "type": "string",
              "url": "string"
            }
          ]
        }
      ]
    }
    */

  }

  getSubjects() {
    let params = { text: '', offset: 0 }
    this.apiService.getResponse('get', SUBJECT, params).
      then(res => {
        this.isLoading = false;
        if (res.status === 200) {
          this.subjects = res.data.subject
        }
      })
  }

  getNameErrorMessage() {
    return this.tempNameFormControl.hasError('required') ? '*You must enter a value' :
      '';
  }

  getIDErrorMessage() {
    return this.tempIdControl.hasError('required') ? '*You must enter a value' :
      '';
  }

  getBoardErrorMessage() {
    return this.boardFormControl.hasError('required') ? '*You must select an option' :
      '';
  }

  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
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

}