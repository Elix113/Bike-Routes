import { TestBed } from '@angular/core/testing';

import { BoundaryService } from './boundary.service';

describe('BoundaryServiceService', () => {
  let service: BoundaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoundaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
