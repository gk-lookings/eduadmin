import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CreateDocumentComponent } from '../create-document/create-document.component';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  tempId = this.activatedRoute.snapshot.params['tempId'];
  subjectName = this.activatedRoute.snapshot.params['subName'];

  constructor(
    public dialog : MatDialog,
    public _location: Location,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
  }
}
