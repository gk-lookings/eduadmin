import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GET_TEMPLATE } from '../config/endpoints';
import { ApiService } from '../services';
import { ConfirmDeleteModelComponent } from '../confirm-delete-model/confirm-delete-model.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  tempId = this.activatedRoute.snapshot.params['tempId'];
  subjectName = this.activatedRoute.snapshot.params['subName'];

  isLoading = true
  template
  notes = []
  isEmpty = false

  subject_detail

  constructor(
    public _location: Location,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    public dialog : MatDialog
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
              this.notes = res.data.subjects[i].notes;
              this.subject_detail = res.data.subjects[i]
            }
          }
          if (this.notes.length == 0)
            this.isEmpty = true

        }
      })
  }
  editNote(item) {
  }

  deleteTemp(item, i) {
    const opendialog = this.dialog.open(ConfirmDeleteModelComponent).afterClosed().subscribe(result => {
      if (result) {
        var index = this.notes.indexOf(item)
        this.notes.splice(index, 1)
        this.subject_detail.notes = this.notes
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
          if (this.notes.length == 0)
            this.isEmpty = true
      }
    })
  }

}
