import { TestBed } from '@angular/core/testing';

import { GalletasService } from './galletas.service';

describe('GalletasService', () => {
  let service: GalletasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GalletasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
