import { TestBed } from '@angular/core/testing';

import { RendezVousService } from './rendezvous.service';

describe('RendezvousService', () => {
  let service: RendezVousService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RendezVousService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
