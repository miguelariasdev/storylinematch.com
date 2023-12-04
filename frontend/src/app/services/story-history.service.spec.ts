import { TestBed } from '@angular/core/testing';

import { StoryHistoryService } from './story-history.service';

describe('StoryHistoryService', () => {
  let service: StoryHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoryHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
