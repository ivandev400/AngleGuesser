import {
  Component,
  ElementRef,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {
  getChangingQuote,
  getResultQuote,
  RESULT_QUOTES,
  CHANGING_QUOTES,
} from './playground-helpers';
import { ScoreService } from '../services/score.service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css'],
})
export class PlaygroundComponent {
  protected readonly scoreService: ScoreService;
  protected readonly isGuessModalOpen = signal(false);
  protected readonly isTaskModalOpen = signal(false);
  protected readonly isScoreModalOpen = signal(false);
  protected readonly isAccessiblePanelOpen = signal(false);
  protected readonly rotateVal = signal(40);
  protected readonly goal = signal(85);
  protected readonly animatedAccuracy = signal(0);
  protected readonly gameStats = signal({
    level: 0,
    totalAccuracy: 0,
  });
  protected readonly resultQuote = signal('');

  private isDragging = false;
  private currentInteractions = {
    lastChangedAt: 75,
    face: 0,
    quote: "Hi, I'm NG the Angle!",
  };

  @ViewChild('staticArrow') staticArrow!: ElementRef;

  protected readonly totalAccuracyPercentage = computed(() => {
    const { level, totalAccuracy } = this.gameStats();
    if (level === 0) {
      return 0;
    }
    return totalAccuracy / level;
  });

  protected readonly updatedInteractions = computed(() => {
    if (
      this.rotateVal() > 75 &&
      Math.abs(this.rotateVal() - this.currentInteractions.lastChangedAt) >
        70 &&
      Math.random() > 0.5
    ) {
      this.currentInteractions = {
        lastChangedAt: this.rotateVal(),
        face: Math.floor(Math.random() * 6),
        quote: getChangingQuote(this.rotateVal()),
      };
    }
    return this.currentInteractions;
  });

  constructor(private score: ScoreService) {
    this.scoreService = this.score;
    this.resetGame();
  }

  resetGame() {
    this.goal.set(Math.floor(Math.random() * 360));
    this.rotateVal.set(40);
  }

  getRotation() {
    return `rotate(${this.rotateVal()}deg)`;
  }

  getIndicatorStyle() {
    return 0.487 * this.rotateVal() - 179.5;
  }

  getIndicatorRotation() {
    return `rotate(${253 + this.rotateVal()}deg)`;
  }

  mouseDown() {
    this.isDragging = true;
  }

  stopDragging() {
    this.isDragging = false;
  }

  mouseMove(e: MouseEvent) {
    const vh30 = 0.3 * document.documentElement.clientHeight;
    if (!this.isDragging) return;

    let pointX = e.pageX - (this.staticArrow.nativeElement.offsetLeft + 2.5);
    let pointY = e.pageY - (this.staticArrow.nativeElement.offsetTop + vh30);

    let calculatedAngle = 0;
    if (pointX >= 0 && pointY < 0) {
      calculatedAngle =
        90 - (Math.atan2(Math.abs(pointY), pointX) * 180) / Math.PI;
    } else if (pointX >= 0 && pointY >= 0) {
      calculatedAngle = 90 + (Math.atan2(pointY, pointX) * 180) / Math.PI;
    } else if (pointX < 0 && pointY >= 0) {
      calculatedAngle =
        270 - (Math.atan2(pointY, Math.abs(pointX)) * 180) / Math.PI;
    } else {
      calculatedAngle =
        270 + (Math.atan2(Math.abs(pointY), Math.abs(pointX)) * 180) / Math.PI;
    }

    this.rotateVal.set(calculatedAngle);
  }

  adjustAngle(degreeChange: number) {
    this.rotateVal.update((x) =>
      x + degreeChange < 0 ? 360 + (x + degreeChange) : (x + degreeChange) % 360
    );
  }

  touchMove(e: Event) {
    let firstTouch = (e as TouchEvent).touches[0];
    if (firstTouch) {
      this.mouseMove({
        pageX: firstTouch.pageX,
        pageY: firstTouch.pageY,
      } as MouseEvent);
    }
  }

  guess() {
    this.isGuessModalOpen.set(true);
    const calcAcc = Math.abs(
      100 - (Math.abs(this.goal() - this.rotateVal()) / 180) * 100
    );
    this.resultQuote.set(getResultQuote(calcAcc));
    this.animatedAccuracy.set(calcAcc > 20 ? calcAcc - 20 : 0);
    this.powerUpAccuracy(calcAcc);
    this.gameStats.update(({ level, totalAccuracy }) => ({
      level: level + 1,
      totalAccuracy: totalAccuracy + calcAcc,
    }));
  }

  showTask() {
    this.isTaskModalOpen.set(true);
  }

  showScoreTable() {
    this.isScoreModalOpen.set(true);
  }

  powerUpAccuracy(finalAcc: number) {
    if (this.animatedAccuracy() >= finalAcc) return;

    let difference = finalAcc - this.animatedAccuracy();
    if (difference > 20) {
      this.animatedAccuracy.update((x) => x + 10.52);
      setTimeout(() => this.powerUpAccuracy(finalAcc), 30);
    } else if (difference > 4) {
      this.animatedAccuracy.update((x) => x + 3.31);
      setTimeout(() => this.powerUpAccuracy(finalAcc), 40);
    } else if (difference > 0.5) {
      this.animatedAccuracy.update((x) => x + 0.49);
      setTimeout(() => this.powerUpAccuracy(finalAcc), 50);
    } else if (difference >= 0.1) {
      this.animatedAccuracy.update((x) => x + 0.1);
      setTimeout(() => this.powerUpAccuracy(finalAcc), 100);
    } else {
      this.animatedAccuracy.update((x) => x + 0.01);
      setTimeout(() => this.powerUpAccuracy(finalAcc), 100);
    }
  }

  close() {
    this.isGuessModalOpen.set(false);
    this.resetGame();
    this.scoreService.updateCurrentPlayer({
      level: this.gameStats().level + 1,
      averageAccuracy: this.totalAccuracyPercentage(),
    });
  }

  reload() {
    window.location.reload();
  }

  closeTask() {
    this.isTaskModalOpen.set(false);
  }

  closeScoreTable() {
    this.isScoreModalOpen.set(false);
  }

  getText() {
    const roundedAcc = Math.floor(this.totalAccuracyPercentage() * 10) / 10;
    let emojiAccuracy = '';
    for (let i = 0; i < 5; i++) {
      emojiAccuracy += roundedAcc >= 20 * (i + 1) ? '🟩' : '⬜️';
    }
    return encodeURIComponent(
      `📐 ${emojiAccuracy} \n My angles are ${roundedAcc}% accurate on level ${
        this.gameStats().level
      }. \n\nHow @Angular are you? \nhttps://angular.dev/playground`
    );
  }

  toggleA11yControls(event: MatSlideToggleChange) {
    this.isAccessiblePanelOpen.set(event.checked);
  }
}
