import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LogOutModelComponent } from '../log-out-model/log-out-model.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private dialog : MatDialog) { }

  ngOnInit() {
  }
  logOut()
  {
   const abc = this.dialog.open(LogOutModelComponent)
  }
}
