import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSingleComponent } from './class-single.component';

describe('ClassSingleComponent', () => {
  let component: ClassSingleComponent;
  let fixture: ComponentFixture<ClassSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
