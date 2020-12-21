import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { GET_TEMPLATE } from '../config/endpoints';
import { ConfirmDeleteModelComponent } from '../confirm-delete-model/confirm-delete-model.component';
import { CreateSectionComponent } from '../create-section/create-section.component';
import { EditSectionComponent } from '../edit-section/edit-section.component';
import { ApiService } from '../services';

@Component({
  selector: 'app-curriculam',
  templateUrl: './curriculam.component.html',
  styleUrls: ['./curriculam.component.css']
})
export class CurriculamComponent implements OnInit {
  isLoading = true
  tempId = this.activatedRoute.snapshot.params['tempId'];
  subjectName = this.activatedRoute.snapshot.params['subName'];
  template
  sections = []
  isEmpty = false
  subject_detail
  constructor(private dialog: MatDialog,
    public _location: Location,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService) { }

  ngOnInit() {
    this.fetchTemplate()
  }
  createSub() {
    const open = this.dialog.open(CreateSectionComponent, { data: { tempId: this.tempId, subjectName: this.subjectName } })
    open.afterClosed().subscribe(result => {
      this.isEmpty = false
      if(result)
      this.fetchTemplate()
    })
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
              this.sections = res.data.subjects[i].sections;
              this.subject_detail = res.data.subjects[i]
            }
          }
          if (this.sections.length == 0)
            this.isEmpty = true

        }
      })
  }
  editDocument(item) {
    const opendial = this.dialog.open(EditSectionComponent, { data : {tempId : this.tempId, item : item, subjectName : this.subjectName}}).afterClosed().subscribe(result => {
      if(result)
      this.fetchTemplate()
    })
  }

  deleteTemp(item, i) {
    const opendialog = this.dialog.open(ConfirmDeleteModelComponent).afterClosed().subscribe(result => {
      if (result) {
        var index = this.sections.indexOf(item)
        this.sections.splice(index, 1)
        this.subject_detail.sections = this.sections
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
        if (this.sections.length == 0)
          this.isEmpty = true
      }
    })
  }

}
