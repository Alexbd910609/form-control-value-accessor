import {ChangeDetectionStrategy, Component, DestroyRef, forwardRef, inject, Input, OnInit} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatFormField, MatError, MatLabel} from "@angular/material/form-field";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SiteUrl} from "../core/interfaces/website/website.interface";

@Component({
  selector: 'app-url-form-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatSelect, MatOption, MatInput, MatError, MatLabel],
  templateUrl: './url-form-field.component.html',
  styleUrl: './url-form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UrlFormFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UrlFormFieldComponent),
      multi: true
    }
  ]
})
export class UrlFormFieldComponent implements ControlValueAccessor, OnInit, Validators {
  private _destroyRef: DestroyRef = inject(DestroyRef);

  public methods: { value: string, viewValue: string }[] = [
    {value: 'https', viewValue: 'HTTPS'},
    {value: 'http', viewValue: 'HTTP'},
    {value: 'ftp', viewValue: 'FTP'}
  ];
  public urlForm: UntypedFormGroup = new UntypedFormGroup({
    method: new UntypedFormControl({value: '', disabled: false}, [Validators.required]),
    url: new UntypedFormControl({value: '', disabled: false}, [Validators.required])
  });

  @Input({required: true}) set invalid(invalid: boolean) {
    if (invalid) {
      this.urlForm.controls['method'].markAsTouched();
      this.urlForm.controls['url'].markAsTouched();
    }
  }

  // private _initForm(data: SiteUrl): void {
  //   this.urlForm.patchValue({
  //     method: data?.method,
  //     url: data?.url
  //   });
  // }

  private _propagateValue(): void {
    this.urlForm.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (): void => {
          this.propagateChange(this.urlForm.value);
          this.validate();
        }
      });
  }

  propagateChange(fn: any): void {
  };

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  writeValue(formValue: SiteUrl): void {
    // if (formValue) {
    //   this._initForm(formValue);
    // }
  }

  registerOnTouched(): void {
  }

  validate(): { invalid: boolean } | null {
    if (this.urlForm.controls['method'].hasError('required') || this.urlForm.controls['url'].hasError('required')) {
      return {invalid: true}
    }
    return null;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.urlForm.disable();
    } else {
      this.urlForm.enable();
    }
  }

  ngOnInit(): void {
    this._propagateValue();
  }
}
