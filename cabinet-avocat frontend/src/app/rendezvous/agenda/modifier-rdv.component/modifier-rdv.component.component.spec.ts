import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierRdvComponentComponent } from './modifier-rdv.component.component';

describe('ModifierRdvComponentComponent', () => {
  let component: ModifierRdvComponentComponent;
  let fixture: ComponentFixture<ModifierRdvComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierRdvComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifierRdvComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
