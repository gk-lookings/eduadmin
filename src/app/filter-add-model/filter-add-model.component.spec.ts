import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAddModelComponent } from './filter-add-model.component';

describe('FilterAddModelComponent', () => {
  let component: FilterAddModelComponent;
  let fixture: ComponentFixture<FilterAddModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterAddModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterAddModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
