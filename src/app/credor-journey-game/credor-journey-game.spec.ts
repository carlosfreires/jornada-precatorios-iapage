import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredorJourneyGame } from './credor-journey-game';

describe('CredorJourneyGame', () => {
  let component: CredorJourneyGame;
  let fixture: ComponentFixture<CredorJourneyGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredorJourneyGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredorJourneyGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
