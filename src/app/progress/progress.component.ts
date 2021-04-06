import { Component, Input, OnInit } from '@angular/core';

import { DashboardComponent } from '../dashboard/dashboard.component';
@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
  @Input() progress = 0;
  constructor() { }

  ngOnInit() {
  }

}
