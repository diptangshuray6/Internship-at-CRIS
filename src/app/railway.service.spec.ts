import { TestBed } from '@angular/core/testing';

import { RailwayService } from './railway.service';

describe('RailwayService', () => {
  let service: RailwayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RailwayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
