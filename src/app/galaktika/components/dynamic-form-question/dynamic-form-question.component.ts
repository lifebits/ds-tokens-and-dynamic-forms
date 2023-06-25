import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {BaseFormControl} from "../../base-form-control";

@Component({
  selector: 'app-dynamic-form-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgSwitch,
    NgIf,
    NgSwitchCase,
    NgForOf
  ],
  standalone: true
})
export class DynamicFormQuestionComponent implements OnInit {
  @Input() formControlModel!: BaseFormControl<string>;
  @Input() form!: FormGroup;

  get isValid() {
    return this.form.get(this.formControlModel.key)?.valid;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
