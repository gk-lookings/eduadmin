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
    if (type == 'scheme') {
      const open = this.dialog.open(FilterAddModelComponent, { data: { data: 'Add Scheme', title: '' }, disableClose: true }).afterClosed().subscribe(result => {
        if (result) {
          content.push(result);
          let params = {
            scheme: content,
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
    if (type == 'course') {
      const open = this.dialog.open(FilterAddModelComponent, { data: { data: 'Add Course', title: '' }, disableClose: true }).afterClosed().subscribe(result => {
        if (result) {
          console.log("rese", result);
          
          console.log("content", content);
          
          content.push(result);
          let params = {
            course: content,
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
          if (res.data.filters.length == 0)
            this.isEmpty = true
        }
      })
  }

  getFIlterSuggest() {
    this.isLoading = true
    this.isEmpty = false
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

  editSubItem(item, depart, i, type) {
    let filterId = item.id
    let content
    let index

    if (type == 'department') {
      const open = this.dialog.open(FilterAddModelComponent, { data: { data: 'Edit Department', title: depart }, disableClose: true }).afterClosed().subscribe(result => {
        if (result) { 
          content = item.department
          index = content.indexOf(depart)
          content[index] = result;
          let params = {
            department: content,
          }
          this.apiService.getResponse('put', FILTER + '/' + filterId, params).
            then(res => {
              if (res.status === 200) {
                // this.getFIlterItems()
              }
            })
        }
      })
    }
    if (type == 'class') {
      const open = this.dialog.open(FilterAddModelComponent, { data: { data: 'Edit Class', title: depart }, disableClose: true }).afterClosed().subscribe(result => {
        if (result) {
          content = item.class
          index = content.indexOf(depart)
          content[index] = result;
          let params = {
            class: content,
          }
          this.apiService.getResponse('put', FILTER + '/' + filterId, params).
            then(res => {
              if (res.status === 200) {
                // this.getFIlterItems()
              }
            })
        }
      })
    }
    if (type == 'semester') {
      const open = this.dialog.open(FilterAddModelComponent, { data: { data: 'Edit Semester', title: depart }, disableClose: true }).afterClosed().subscribe(result => {
        if (result) {
          content = item.semester
          index = content.indexOf(depart)
          content[index] = result;
          let params = {
            semester: content,
          }
          this.apiService.getResponse('put', FILTER + '/' + filterId, params).
            then(res => {
              if (res.status === 200) {
                // this.getFIlterItems()
              }
            })
        }
      })
    }
    if (type == 'grade') {
      const open = this.dialog.open(FilterAddModelComponent, { data: { data: 'Edit Grade', title: depart }, disableClose: true }).afterClosed().subscribe(result => {
        if (result) {
          content = item.grade
          index = content.indexOf(depart)
          content[index] = result;
          let params = {
            grade: content,
          }
          this.apiService.getResponse('put', FILTER + '/' + filterId, params).
            then(res => {
              if (res.status === 200) {
                // this.getFIlterItems()
              }
            })
        }
      })
    }
    if (type == 'scheme') {
      const open = this.dialog.open(FilterAddModelComponent, { data: { data: 'Edit Scheme', title: depart }, disableClose: true }).afterClosed().subscribe(result => {
        if (result) {
          content = item.scheme
          index = content.indexOf(depart)
          content[index] = result;
          let params = {
            scheme: content,
          }
          this.apiService.getResponse('put', FILTER + '/' + filterId, params).
            then(res => {
              if (res.status === 200) {
                // this.getFIlterItems()
              }
            })
        }
      })
    }

    if (type == 'course') {
      const open = this.dialog.open(FilterAddModelComponent, { data: { data: 'Edit Course', title: depart }, disableClose: true }).afterClosed().subscribe(result => {
        if (result) {
          content = item.course
          index = content.indexOf(depart)
          content[index] = result;
          let params = {
            course: content,
          }
          this.apiService.getResponse('put', FILTER + '/' + filterId, params).
            then(res => {
              if (res.status === 200) {
                // this.getFIlterItems()
              }
            })
        }
      })
    }

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
        })
    }
    if (type == 'scheme') {
      content = item.scheme
      index = content.indexOf(depart)
      content.splice(index, 1)
      this.filtersList[i].scheme = content
      let params = {
        scheme: content,
      }
      this.apiService.getResponse('put', FILTER + '/' + filterId, params).
        then(res => {
        })
    }
    if (type == 'course') {
      content = item.course
      index = content.indexOf(depart)
      content.splice(index, 1)
      this.filtersList[i].course = content
      let params = {
        course: content,
      }
      this.apiService.getResponse('put', FILTER + '/' + filterId, params).
        then(res => {
        })
    }
  }

}
