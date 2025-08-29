import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScoreService } from '../services/score.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  fg: FormGroup;
  scoreService: ScoreService;
  protected readonly successMessage = signal('');
  protected readonly errorMessage = signal('');
  protected readonly warningMessage = signal('Nickname must be unique');
  protected readonly isGameStarted = signal(false);
  protected readonly isRegistrationOpen = signal(true);

  constructor(private formBuilder: FormBuilder, private service: ScoreService) {
    this.scoreService = this.service,
    this.fg = this.formBuilder.group({
      nameFields: ['', [Validators.required]],
      nickName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  clear() {
    this.fg.reset();
    this.successMessage.set('');
    this.errorMessage.set('');
    this.warningMessage.set('');
  }

  newScore() {
    this.scoreService.registerPlayer(
      this.fg.value.nameFields,
      this.fg.value.nickName
    );
  }

  StartGame() {
    if (this.fg.valid) {
      this.newScore();
      this.warningMessage.set('');
      this.isRegistrationOpen.set(false);
      this.isGameStarted.set(true);
      this.successMessage.set('Game started successfully!');
    }
    if (!this.scoreService.isNicknameTaken(this.fg.value.nickName)) {
      this.errorMessage.set('The nickname has been taken already');
    } else {
      this.errorMessage.set('Please fill all fields correctly');
    }
  }
}
