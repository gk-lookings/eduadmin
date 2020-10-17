import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateSubjectsComponent } from './template-subjects.component';

describe('TemplateSubjectsComponent', () => {
  let component: TemplateSubjectsComponent;
  let fixture: ComponentFixture<TemplateSubjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateSubjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
