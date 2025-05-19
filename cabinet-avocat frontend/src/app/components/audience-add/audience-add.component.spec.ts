import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudienceAddComponent } from './audience-add.component';

describe('AudienceAddComponent', () => {
  let component: AudienceAddComponent;
  let fixture: ComponentFixture<AudienceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudienceAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudienceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
