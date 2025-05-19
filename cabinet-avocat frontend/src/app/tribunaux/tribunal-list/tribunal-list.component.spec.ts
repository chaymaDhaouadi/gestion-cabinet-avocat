import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TribunalListComponent } from './tribunal-list.component';

describe('TribunalListComponent', () => {
  let component: TribunalListComponent;
  let fixture: ComponentFixture<TribunalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TribunalListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TribunalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
