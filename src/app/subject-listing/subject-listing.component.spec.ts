import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectListingComponent } from './subject-listing.component';

describe('SubjectListingComponent', () => {
  let component: SubjectListingComponent;
  let fixture: ComponentFixture<SubjectListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
