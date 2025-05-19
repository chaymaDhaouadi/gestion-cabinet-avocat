import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierListComponentComponent } from './dossier-list-component.component';

describe('DossierListComponentComponent', () => {
  let component: DossierListComponentComponent;
  let fixture: ComponentFixture<DossierListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DossierListComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DossierListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
