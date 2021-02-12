import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FILTER } from '../config/endpoints';
import { FilterAddModelComponent } from '../filter-add-model/filter-add-model.component';
import { ApiService, AuthenticationService } from '../services';

@Component({
  selector: 'app-create-filter',
  templateUrl: './create-filter.component.html',
  styleUrls: ['./create-filter.component.css']
})
export class CreateFilterComponent implements OnInit {

  filtersList
  currentPage = 0
  searchkey = ''
  txtQueryChanged = new Subject<string>();


  popoverTitle = 'Are you sure?';
  popoverMessage = 'Are you really want to do this?';
  confirmClicked = false;
  cancelClicked = false;

  isLoading = true
  isEmpty = false

  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, private http: HttpClient, public dialog: MatDialog) {
    this.txtQueryChanged.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(model => {
        this.isEmpty = false
        this.searchkey = model;
        if (this.searchkey)
          this.getFIlterSuggest()
        else {
          this.isLoading = true
          this.getFIlterItems()
        }
      });
  }

  ngOnInit() {
    this.getFIlterItems()
  }

  searchResults(query: string) {
    this.txtQueryChanged.next(query);
  }

  removeBoard(id) {
    let params = {}
    this.apiService.getResponse('delete', FILTER + '/' + id, params).
      then(res => {
        if (res.status === 200) {
          if (this.searchkey)
            this.getFIlterSuggest()
          else
            this.getFIlterItems()
        }
      })
  }

  createBoard() {
    const open = this.dialog.open(FilterAddModelComponent, { data: { data: 'Create Board/University', title: '' }, disableClose: true }).afterClosed().subscribe(result => {
      if (result) {
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


  editBoard(item) {
    const open = this.dialog.open(FilterAddModelComponent, { data: { data: 'Edit Board/University', title: item.board }, disableClose: true }).afterClosed().subscribe(result => {
      if (result) {
        let params = {
          "board": result,
        }
        this.apiService.getResponse('put', FILTER + '/' + item.id, params).
          then(res => {
            if (res.status === 200) {
              this.getFIlterItems()
            }
          })
      }

    })
  }



  addFilterElement(type, id, data) {
    let content = []
    content = data
    if (type == 'department') {
      const open = this.dialog.open(FilterAddModelComponent, { data: { data: 'Add Department', title: '' }, disableClose: true }).afterClosed().subscribe(result => {
        if (result) {
          content.push(result);
          let params = {
            department: content,
          }
          this.apiService.getResponse('put', FILTER + '/' + id, params).
            then(res => {
              if (res.status === 200) {
                // this.getFIlterItems()
              }
            })
        }
      })
    }
    if (type == 'class') {
      const open = this.dialog.open(FilterAddModelComponent, { data: { data: 'Add Class', title: '' }, disableClose: true }).afterClosed().subscribe(result => {
        if (result) {
          content.push(result);
          let params = {
            class: content,
          }
          this.apiService.getResponse('put', FILTER + '/' + id, params).
            then(res => {
              if (res.status === 200) {
                // this.getFIlterItems()
              }
            })
        }
      })
    }
    if (type == 'semester') {
      const open = this.dialog.open(FilterAddModelComponent, { data: { data: 'Add Semester', title: '' }, disableClose: true }).afterClosed().subscribe(result => {
        if (result) {
          content.push(result);
          let params = {
            semester: content,
          }
          this.apiService.getResponse('put', FILTER + '/' + id, params).
            then(res => {
              if (res.status === 200) {
                // this.getFIlterItems()
              }
            })
        }
      })
    }
    if (type == 'grade') {
      const open = this.dialog.open(FilterAddModelComponent, { data: { data: 'Add Grade', title: '' }, disableClose: true }).afterClosed().subscribe(result => {
        if (result) {
          content.push(result);
          let params = {
            grade: content,
          }
          this.apiService.getResponse('put', FILTER + '/' + id, params).
            then(res => {
              if (res.status === 200) {
                // this.getFIlterItems()
              }
            })
        }
      })
    }
  }

  getFIlterItems() {
    let params = {}
    this.apiService.getResponse('get', FILTER, params).
      then(res => {
        if (res.status === 200) {
          this.isLoading = false
          this.filtersList = res.data.filters
        }
      })
  }

  getFIlterSuggest() {
    this.isLoading = true
    let params = { term: this.searchkey, offset: 0, count: 10 }
    this.apiService.getResponse('get', FILTER + '/suggest', params).
      then(res => {
        if (res.status === 200) {
          this.isLoading = false
          this.filtersList = res.data.filters
          if (res.data.filters.length == 0)
            this.isEmpty = true
        }
      })
  }

  removeSubItem(item, depart, i, type) {
    let filterId = item.id
    let content
    let index
    if (type == 'department') {
      content = item.department
      index = content.indexOf(depart)
      content.splice(index, 1)
      this.filtersList[i].department = content
      let params = {
        department: content,
      }
      this.apiService.getResponse('put', FILTER + '/' + filterId, params).
        then(res => {
          console.log("res depetment", res);
        })
    }
    if (type == 'class') {
      content = item.class
      index = content.indexOf(depart)
      content.splice(index, 1)
      this.filtersList[i].class = content
      let params = {
        class: content,
      }
      this.apiService.getResponse('put', FILTER + '/' + filterId, params).
        then(res => {
          console.log("res class", res);
        })
    }
    if (type == 'semester') {
      content = item.semester
      index = content.indexOf(depart)
      content.splice(index, 1)
      this.filtersList[i].semester = content
      let params = {
        semester: content,
      }
      this.apiService.getResponse('put', FILTER + '/' + filterId, params).
        then(res => {
          console.log("res semester", res);
        })
    }
    if (type == 'grade') {
      content = item.grade
      index = content.indexOf(depart)
      content.splice(index, 1)
      this.filtersList[i].grade = content
      let params = {
        grade: content,
      }
      this.apiService.getResponse('put', FILTER + '/' + filterId, params).
        then(res => {
          console.log("res grade", res);
        })
    }
  }

}
