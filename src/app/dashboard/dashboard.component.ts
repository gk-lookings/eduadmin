import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LogOutModelComponent } from '../log-out-model/log-out-model.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  events: string[] = [];
  opened: boolean = true;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  page_title =''

  constructor(private router: Router, private breakpointObserver: BreakpointObserver, media: MediaMatcher, private dialog: MatDialog) { 
    this.mobileQuery = media.matchMedia('(max-width: 1024px)');
    if (this.router.url === '/dashboard')
      this.router.navigate(['dashboard/home']);
  }

  ngOnInit() {
  }

  logOut() {
    const abc = this.dialog.open(LogOutModelComponent)
  }
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 50) {
      document.querySelector('.scrollTop').classList.add('d-flex');
    }
    else {
      document.querySelector('.scrollTop').classList.remove('d-flex');
    }
  }
  setPageTitle(title)
  {
    this.page_title = title
  }

}
