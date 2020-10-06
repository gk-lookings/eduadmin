import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ApiService, AuthenticationService } from '../services';

@Component({
  selector: 'app-create-subject',
  templateUrl: './create-subject.component.html',
  styleUrls: ['./create-subject.component.css']
})
export class CreateSubjectComponent implements OnInit {

 
  subId: string;
  subName: string;
  responseMessage: string;
  isLoading: boolean;
  success: boolean;
  subNameFormControl = new FormControl('', Validators.required);

  createForm: FormGroup = new FormGroup({
    subName: this.subNameFormControl
  });

  constructor(private apiService: ApiService, private router: Router, private authService: AuthenticationService, private http: HttpClient, public dialogRef : MatDialogRef<CreateSubjectComponent>) { }

  ngOnInit() {
  }

  getNameErrorMessage() {
    return this.subNameFormControl.hasError('required') ? '*You must enter a value' :
      '';
  }

}
