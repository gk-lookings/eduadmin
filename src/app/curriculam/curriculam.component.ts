import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateSectionComponent } from '../create-section/create-section.component';

@Component({
  selector: 'app-curriculam',
  templateUrl: './curriculam.component.html',
  styleUrls: ['./curriculam.component.css']
})
export class CurriculamComponent implements OnInit {

  constructor(private dialog : MatDialog) { }

  ngOnInit() {
  }
  createSub(){
    let open = this.dialog.open(CreateSectionComponent)
  }

}
