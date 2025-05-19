import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutRdvDialogComponent } from './ajout-rdv-dialog.component';

describe('AjoutRdvDialogComponent', () => {
  let component: AjoutRdvDialogComponent;
  let fixture: ComponentFixture<AjoutRdvDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutRdvDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AjoutRdvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
