import { environment } from '../../environments/environment';

import { Component, OnInit } from '@angular/core';
import { DatePipe, JsonPipe, NgForOf, NgIf } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {count, delay, interval, map, mergeMap, Observable, take, tap, timestamp, toArray} from "rxjs";

import { BaseFormControl } from './base-form-control';
import { BaseControlService } from './base-control.service';
import { DynamicFormQuestionComponent } from './components/dynamic-form-question/dynamic-form-question.component';

interface ConfigurationResponse {
  count: number;
  delay: number;
}

interface ConfigForm {
  configuration: FormControl<ConfigurationResponse>;
  logic?: FormGroup;
}

interface GalaktikaFormControl {
  action?: BaseFormControl;
  requestTimestamp: Date;
  responseTimestamp: Date;
  status?: string;
  order?: number;
}

@Component({
  selector: 'app-galaktika',
  templateUrl: './galaktika.component.html',
  styleUrls: ['./galaktika.component.scss'],
  imports: [
    ReactiveFormsModule,
    NgForOf,
    DatePipe,
    NgIf,
    DynamicFormQuestionComponent,
    JsonPipe
  ],
  providers: [BaseControlService],
  standalone: true
})
export class GalaktikaComponent implements OnInit {
  formGroup = new FormGroup<ConfigForm>({
    configuration: new FormControl(),
  });

  get formLogic(): FormGroup {
    return this.formGroup.get('logic') as FormGroup;
  }

  formDatRaw!: any;

  responseList: Array<{ value: any, timestamp: number }> = [];

  isLoading = false;
  totalRequestCount = 0;
  finishedRequest = 0;

  constructor(private http: HttpClient, private controlService: BaseControlService) { }

  ngOnInit(): void {
    this.requestConfig()
      .subscribe(value => {
      this.formGroup.get('configuration')?.patchValue(value);
    });
  }

  onSubmit(form: FormGroup<ConfigForm>) {
    this.formDatRaw = form.getRawValue();
  }

  generateRequests(form: FormGroup<ConfigForm>) {
    const configuration = form.value.configuration;
    const requestList = Array.from(Array(configuration?.count)).map((a, index) => index);
    console.log({configuration, requestList});

    this.isLoading = true;
    this.formDatRaw = null;

    this.totalRequestCount = requestList.length;
    this.finishedRequest = 0;
    interval(configuration ? configuration.delay : 0)
      .pipe(
        take(requestList.length),
        mergeMap(index => this.request(index)),
        tap(() => ++this.finishedRequest),
        timestamp(),
        toArray(),
        map(array => array.sort((a, b) => {
          return a.value.requestTimestamp.getTime() - b.value.requestTimestamp.getTime();
        }))
      )
      .subscribe((value) => {
        console.log(value);
        this.responseList = value;
        this.isLoading = false;
        // const controls = value.map(v => v.value).map(v => v.action);
        // this.formGroup.addControl('logic', this.controlService.toFormGroup(controls));
      });
  }

  private requestConfig(): Observable<ConfigurationResponse> {
    // const url = environment.baseUrl + '/galaktika/config';
    const url = 'http://localhost:4521';
    return this.http.post<ConfigurationResponse>(url, {action: "params"}).pipe(
      map(config => {
        return {
          count: Number(config.count),
          delay: Number(config.delay)
        };
      })
    )
  }

  private request(requestNumber: number) {
    // const url = environment.baseUrl + '/galaktika/data'
    const url = 'http://localhost:4521';
    const requestTime = new Date();
    const requestData = {
      action: requestNumber
    };
    return this.http.post<GalaktikaFormControl>(url, {action: "process"}).pipe(
      map(data => {
        data.requestTimestamp = requestTime;
        if (data.status) {
          data.responseTimestamp = new Date(data.status.slice(0, -4));
          data.order = requestNumber;
        }
        return data;
      })
    )
  }
}
