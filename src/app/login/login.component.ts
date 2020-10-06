import { Component, OnInit } from '@angular/core';
import { ApiService } from './../services';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from './../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LOGIN } from '../config/endpoints';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  responseMessage: string;
  isLoading:boolean;
  success:boolean;
  emailFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', Validators.required);
  hide
  loginForm: FormGroup = new FormGroup({
    username: this.emailFormControl,
    password: this.passwordFormControl
  });

  constructor(private apiService: ApiService, private router:Router, private authService: AuthenticationService, private http: HttpClient) { }
 
  ngOnInit() {
  }
  
  getEmailErrorMessage() {
    return this.emailFormControl.hasError('required') ? 'You must enter a value' :
      this.emailFormControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  getPasswordErrorMessage() {
    return this.passwordFormControl.hasError('required') ? 'You must enter a value' :
        '';
  }
  
  loginSubmit() {
    this.isLoading=true;
    let params = {
      "email": this.username,
      "password": this.password,
      "countryCode": "",
      "phone": "",
      "userDetails": {
        "firstName": "",
        "lastName": ""
      }
    }
    this.apiService.getResponse('post', LOGIN, params).
      then(res => {
        this.isLoading=false;
        if (res.status === 200) {
          this.success=true;
          this.authService.setCurrentUser(res)
          this.router.navigate(['dashboard/home']);
        }
        else {
          this.responseMessage = res.error.message
          this.success=false;
        }
      })
  }
}
