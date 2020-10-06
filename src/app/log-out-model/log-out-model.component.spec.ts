import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogOutModelComponent } from './log-out-model.component';

describe('LogOutModelComponent', () => {
  let component: LogOutModelComponent;
  let fixture: ComponentFixture<LogOutModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogOutModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogOutModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
