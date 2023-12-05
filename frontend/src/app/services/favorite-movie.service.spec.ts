import { TestBed } from '@angular/core/testing';

import { FavoriteMovieService } from './favorite-movie.service';

describe('FavoriteMovieService', () => {
  let service: FavoriteMovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteMovieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
