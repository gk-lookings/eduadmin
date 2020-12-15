import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteModelComponent } from './confirm-delete-model.component';

describe('ConfirmDeleteModelComponent', () => {
  let component: ConfirmDeleteModelComponent;
  let fixture: ComponentFixture<ConfirmDeleteModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
