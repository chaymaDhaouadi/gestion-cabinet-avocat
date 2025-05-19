import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTribunalComponent } from './edit-tribunal.component';

describe('EditTribunalComponent', () => {
  let component: EditTribunalComponent;
  let fixture: ComponentFixture<EditTribunalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTribunalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTribunalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
