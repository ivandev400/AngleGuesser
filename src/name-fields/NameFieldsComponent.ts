import { Component, Input, forwardRef, signal } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-name-fields',
  templateUrl: './name-fields.component.html',
  styleUrls: ['./name-fields.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NameFieldsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NameFieldsComponent),
      multi: true,
    },
  ],
})
export class NameFieldsComponent implements ControlValueAccessor {
  @Input() minLen: number = 0;
  @Input() maxLen: number = 0;
  readonly successMessage = signal('');
  readonly errorMessage = signal('');
  readonly warningMessage = signal('Make sure the characters are more than 6 and less than 20');
  value: string = '';
  disabled = false;
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: string): void {
    this.value = value || '';
    this.onChange(this.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.warningMessage.set('');
    this.onChange(value);
    this.onTouched();
  }

  validate(control: FormControl) {
    const value = control.value || '';
    const nameParts = value.split(' ').filter((part: string) => part.trim());
    const fullNameLength = nameParts.join('').length;

    if (fullNameLength < this.minLen) {
      this.errorMessage.set(`Minimum ${this.minLen} characters required, ${fullNameLength} actual characters`);
    }
    if (fullNameLength > this.maxLen) {
      this.errorMessage.set(`Maximum ${this.maxLen} characters required, ${fullNameLength} actual characters`);
    }
    if (!value.trim()){
      this.errorMessage.set('Full name required');
    }
    if (fullNameLength > this.minLen && fullNameLength < this.maxLen)
    {
      this.errorMessage.set('');
    }
    return null;
  }
}
