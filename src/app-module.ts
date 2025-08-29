import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PlaygroundComponent } from './game/PlaygroundComponent';
import { RegistrationComponent } from './registration/RegistrationComponent';
import { ScoreTableComponent } from './score-table/ScoreTableComponent';
import { MessageComponent } from './message/MessageComponent';
import { NameFieldsComponent } from './name-fields/NameFieldsComponent';
import { A11yModule } from '@angular/cdk/a11y';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PlaygroundComponent,
    RegistrationComponent,
    MessageComponent,
    NameFieldsComponent,
    ScoreTableComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MatSlideToggleModule,
    A11yModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [RegistrationComponent],
})
export class AppModule {}
