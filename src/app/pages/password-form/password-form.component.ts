import { Component, DestroyRef, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.less',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordFormComponent),
      multi: true
    }
  ]
})
export class PasswordFormComponent implements ControlValueAccessor, OnInit {

  passwordControl = new FormControl('');

  onChange?: (val: string) => void;
  onTouch?: () => void;

  constructor(
    private readonly destroyRef: DestroyRef
  ) {
  }

  ngOnInit() {
    this.passwordControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(v => this.onChange?.(v ?? ''))
  }

  writeValue(val: string | null): void {
    this.passwordControl.setValue(val ?? '');
  }

  registerOnChange(fn: (val: string) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn:  () => void) {
    this.onTouch = fn;
  }

  addNumber(num: string) {
    this.passwordControl.setValue(this.passwordControl.value! + num);
  }

  removeNumber() {
    const ctrlValue = this.passwordControl.value! ?? '';
    this.passwordControl.setValue(ctrlValue.slice(0, -1));
  }
}
