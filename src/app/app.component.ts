import { Component, OnInit } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './services/auth.service';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'edu-app';
  state: RouterStateSnapshot;
  elements
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    @Inject(DOCUMENT) private _document: HTMLDocument
  ) { }

  ngOnInit() {
    // const currentUser = this.authenticationService.getcurrentUser();
    // if (!currentUser)
    // this.router.navigate(['/login']);
    // else
    // this.router.navigate(['dashboard/home']);    

    const currentUser = this.authenticationService.getcurrentUser();
    let url = window.location.href;   
    let temp = url.split('/').length
    let navigator = url.split('/').splice(temp - 2, temp - 1)
    
    console.log("url", this.state);
    
    if (!currentUser) {
      if (navigator[1] != "")
        this.router.navigate(['/login'], { queryParams: { returnUrl: this.state.url } });
      else
        this.router.navigate(['/login'])
    }
    else{
      this.router.navigate(['dashboard/home']);
    }
  }
}
