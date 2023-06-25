import { Injectable } from "@angular/core";
import { BaseFormControl } from "./base-form-control";
import { FormControl, FormGroup, Validators } from "@angular/forms";

export class BaseControlService {
  toFormGroup(controls: BaseFormControl[]) {
    const group: any = {};
    controls.forEach((control) => {
      group[control.key] = control.required
        ? new FormControl(control.value || '', Validators.required)
        : new FormControl(control.value || '')
    });
    return new FormGroup(group);
  }
}
