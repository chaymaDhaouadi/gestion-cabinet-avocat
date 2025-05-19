import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRdvDateComponentComponent } from './list-rdv-date-component.component';

describe('ListRdvDateComponentComponent', () => {
  let component: ListRdvDateComponentComponent;
  let fixture: ComponentFixture<ListRdvDateComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRdvDateComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListRdvDateComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
