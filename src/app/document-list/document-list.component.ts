import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateDocumentComponent } from '../create-document/create-document.component';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  constructor(public dialog : MatDialog) { }

  ngOnInit() {
  }
}
