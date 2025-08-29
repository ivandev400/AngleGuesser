import { Injectable, signal } from '@angular/core';

export interface PlayerScore {
  fullName: string;
  nickName: string;
  level: number;
  averageAccuracy: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private scores = signal<PlayerScore[]>([]);
  private currentPlayer = signal<PlayerScore | null>(null);

  readonly playerScores = this.scores.asReadonly();

  registerPlayer(fullName: string, nickName: string) {
    const newPlayer = {
      fullName,
      nickName,
      level: 1,
      averageAccuracy: 0
    };
    this.currentPlayer.set(newPlayer);
    this.scores.update(score => [...score, newPlayer]);
  }

  updateCurrentPlayer(updates: Partial<PlayerScore>) {
    const player = this.currentPlayer();
    if (player) {
      const updated = { ...player, ...updates };
      this.currentPlayer.set(updated);
      this.updateScores(updated);
    }
  }

  private updateScores(updatedPlayer: PlayerScore) {
    this.scores.update(scores => 
      scores.map(score => 
        score.nickName === updatedPlayer.nickName ? updatedPlayer : score
      )
    );
  }

  isNicknameTaken(nickname: string): boolean {
    return this.scores().some(score => 
      score.nickName.toLowerCase() === nickname.toLowerCase()
    );
  }

  clearScores() {
    this.scores.set([]);
  }
}