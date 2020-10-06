import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculamComponent } from './curriculam.component';

describe('CurriculamComponent', () => {
  let component: CurriculamComponent;
  let fixture: ComponentFixture<CurriculamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurriculamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurriculamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
