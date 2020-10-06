import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateSubjectComponent } from '../create-subject/create-subject.component';

@Component({
  selector: 'app-subject-listing',
  templateUrl: './subject-listing.component.html',
  styleUrls: ['./subject-listing.component.css']
})
export class SubjectListingComponent implements OnInit {

  constructor(private dialog : MatDialog) { }

  ngOnInit() {
  }

  createSub()
  {
    let open = this.dialog.open(CreateSubjectComponent)
  }
}
