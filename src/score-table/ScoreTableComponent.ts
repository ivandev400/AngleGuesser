import { Component, inject } from '@angular/core';
import { ScoreService } from '../services/score.service';
import { faker } from '@faker-js/faker';

@Component({
  selector: 'app-score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.css'],
})
export class ScoreTableComponent {
  private scoreService = inject(ScoreService);
  scores = this.scoreService.playerScores;

  mockScores = Array.from({ length: 8 }, () => ({
    fullName: faker.person.fullName(),
    nickName: faker.internet.userName(),
    level: faker.number.int({ min: 1, max: 20 }),
    averageAccuracy: faker.number.float({ min: 50, max: 100 }),
  }));
}
