import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { GET_TEMPLATE } from '../config/endpoints';
import { ConfirmDeleteModelComponent } from '../confirm-delete-model/confirm-delete-model.component';
import { ApiService } from '../services';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  isLoading  = true
  tempId = this.activatedRoute.snapshot.params['tempId'];
  subjectName = this.activatedRoute.snapshot.params['subName'];
  template
  documents =[]
  isEmpty = false
  subject_detail
  constructor(
    public dialog : MatDialog,
    public _location: Location,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
    ) { }

  ngOnInit() {
    this.fetchTemplate()
  }

  fetchTemplate() {
    let params = {}
    this.apiService.getResponse('get', GET_TEMPLATE + this.tempId, params).
      then(res => {
        if (res.status === 200) {
          this.isLoading = false
          this.template = res.data
          for (let i = 0; i < res.data.subjects.length; i++) {
            if (res.data.subjects[i]._id == this.subjectName) {
              this.documents = res.data.subjects[i].documents;
              this.subject_detail = res.data.subjects[i]
            }
          }
          if(this.documents.length == 0)
          this.isEmpty = true
          
        }
      })
  }
  editDocument(item) {
  }

  deleteTemp(item, i) {
    const opendialog = this.dialog.open(ConfirmDeleteModelComponent).afterClosed().subscribe(result => {
      if (result) {
        var index = this.documents.indexOf(item)
        this.documents.splice(index, 1)
        this.subject_detail.documents = this.documents
        let params = {
          "templateId": this.tempId,
          "name": this.template.name,
          "descriptionTags": this.template.descriptionTags,
          "active": this.template.active,
          "about": this.template.about,
          "subjects": this.subject_detail
        }
        this.apiService.getResponse('put', GET_TEMPLATE + this.tempId, params).
          then(res => {
          })
          if (this.documents.length == 0)
            this.isEmpty = true
      }
    })
  }
}
