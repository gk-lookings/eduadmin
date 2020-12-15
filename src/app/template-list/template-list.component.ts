import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GET_TEMPLATE, TEMPLATE_LIST } from '../config/endpoints';
import { ApiService, AuthenticationService } from '../services';
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog } from '@angular/material';
import { ConfirmDeleteModelComponent } from '../confirm-delete-model/confirm-delete-model.component';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.css']
})
export class TemplateListComponent implements OnInit {
  isLoading
  templates
  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, private spinner: NgxSpinnerService, public dialog :MatDialog) { }

  ngOnInit() {
    this.fetchList()
  }

  fetchList() {
    this.isLoading = true;
    this.spinner.show();
    let params = { text: '', offset: 0 }
    this.apiService.getResponse('get', TEMPLATE_LIST, params).
      then(res => {
        this.isLoading = false;
        this.spinner.hide();
        console.log("res", res);
        if (res.status === 200) {
          this.templates = res.data.templates
        }
      })
  }

  deleteTemp(id) {
    const opendialog = this.dialog.open(ConfirmDeleteModelComponent).afterClosed().subscribe(result => {
      if (result) {
        let params = {}
        this.apiService.getResponse('delete', GET_TEMPLATE + id, params).
          then(res => {
            if (res.status === 200) {
              let par = { text: '', offset: 0 }
              this.apiService.getResponse('get', TEMPLATE_LIST, par).
                then(res => {
                  if (res.status === 200) {
                    this.templates = res.data.templates
                  }
                })
            }
          })
      }
    }
    )
  }

}
