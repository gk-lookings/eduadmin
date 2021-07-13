import { Component, Input, OnInit } from '@angular/core';
import { CLASSROOM } from '../config/endpoints';
import { ApiService } from '../services';

@Component({
  selector: 'app-class-single',
  templateUrl: './class-single.component.html',
  styleUrls: ['./class-single.component.css']
})
export class ClassSingleComponent implements OnInit {
  @Input() item
  @Input() last
  isActive

  popoverTitle = 'Are you sure?';
  popoverMessage = 'Are you really want to do this?';
  confirmClicked = false;
  cancelClicked = false;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.isActive = this.item && this.item.active
  }

  deactivate(id)
  {
    let params = { 'active' : !this.isActive }
    this.apiService.getResponse('put', CLASSROOM + id, params).
      then(res => {
        if (res.status === 200) {
          this.isActive = !this.isActive
        }
      })
  }


}
