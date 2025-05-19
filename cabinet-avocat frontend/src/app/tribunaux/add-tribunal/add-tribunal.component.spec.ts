import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTribunalComponent } from './add-tribunal.component';

describe('AddTribunalComponent', () => {
  let component: AddTribunalComponent;
  let fixture: ComponentFixture<AddTribunalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTribunalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTribunalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
