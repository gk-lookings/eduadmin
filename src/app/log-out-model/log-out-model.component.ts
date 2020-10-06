import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AuthenticationService } from './../services'
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-out-model',
  templateUrl: './log-out-model.component.html',
  styleUrls: ['./log-out-model.component.scss']
})
export class LogOutModelComponent implements OnInit {

  constructor(public dialog: MatDialogRef<LogOutModelComponent>, private authService : AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  close(){
    this.dialog.close();
  }
  submit()
  {
    this.authService.logout();
    this.dialog.close();
    this.router.navigate(['/login']);
  }

}
