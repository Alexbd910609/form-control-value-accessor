import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {MatFormField, MatLabel, MatError} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {UrlFormFieldComponent} from "./url-form-field/url-form-field.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatButton} from "@angular/material/button";
import {Website} from "./core/interfaces/website/website.interface";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, MatFormField, MatInput, MatLabel, MatError, UrlFormFieldComponent, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private _destroyRef: DestroyRef = inject(DestroyRef);
  private _defaultData: Website = {
    name: 'Default Name',
    siteUrl: {
      method: 'https',
      url: 'default-url.com'
    }
  }

  public invalidForm: boolean = false;
  public webSiteForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl({value: '', disabled: false}, [Validators.required]),
    siteUrl: new UntypedFormControl({value: '', disabled: false})
  });

  private _getDefaultData() {
    this.webSiteForm.patchValue(this._defaultData);
  }

  public populateForm(): void {
    this._getDefaultData();

  }

  public showAlert(): void {
    if (this.webSiteForm.invalid) {
      this.invalidForm = true;
      return;
    }

    alert(
      'Web Site Name: ' + this.webSiteForm.controls['name'].value + '\n' +
      'Web Site Url: ' + this.webSiteForm.controls['siteUrl'].value.method + '://' + this.webSiteForm.controls['siteUrl'].value.url
    );
  }

  ngOnInit(): void {
    this.webSiteForm.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (value): void => {
          console.log(value);
        },
        error: (error): void => {
          console.log(error);
        }
      });
  }
}
