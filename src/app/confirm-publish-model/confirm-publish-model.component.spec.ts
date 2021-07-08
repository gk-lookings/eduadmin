import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPublishModelComponent } from './confirm-publish-model.component';

describe('ConfirmPublishModelComponent', () => {
  let component: ConfirmPublishModelComponent;
  let fixture: ComponentFixture<ConfirmPublishModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPublishModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPublishModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
