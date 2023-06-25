import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TokenManager } from './token-manager';
import { map, Observable } from "rxjs";

function getRandomVal(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

function generateHEXColor(): string {
  return '#' + Math.random().toString(16).substr(-6);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private http: HttpClient) {
    // this.updateThemeTokens();
  }
}
