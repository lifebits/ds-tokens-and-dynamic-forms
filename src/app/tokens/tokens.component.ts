import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TokenManager } from '../token-manager';
import { map, Observable } from "rxjs";

function getRandomVal(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

function generateHEXColor(): string {
  return '#' + Math.random().toString(16).substr(-6);
}

@Component({
  standalone: true,
  imports: [HttpClientModule],
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent implements OnInit {

  private themeManager = new TokenManager();

  static generateHSLColor(): string {
    const h = getRandomVal(1, 360);
    const s = getRandomVal(0, 100);
    const l = getRandomVal(0, 100);
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {}

  changeThemeTokens(): void {
    const newColors = {
      'background-success': TokensComponent.generateHSLColor(),
      'background-warning': TokensComponent.generateHSLColor()
    };
    this.themeManager.varsCacheProxy = Object.assign(this.themeManager.varsCacheProxy, newColors);
  }

  // --isp-background-success-basis: 136.8deg, 64.9350649351%;
// --isp-background-success-lightness: 30.1960784314%;
// --isp-background-success__hover: hsl(var(--isp-background-success-basis), var(--isp-background-success-lightness));

  /* Applying a new theme */
  requestCustomTheme(): Observable<{[key:string]: string}> {
    return this.http.get('/assets/custom-theme.json').pipe(
      map((data: any) => data?.colors),
      map((colors: any) => {
        return Object.keys(colors).reduce((acc: any, current) => {
          const colorsGroup = colors[current];
          const colorTokensListOriginal = Object.keys(colorsGroup).map((colorName) => {
            const obj: {[key:string]: string} = {};
            obj[`${current}-${colorName}`] = colorsGroup[colorName];
            return obj;
          });
          colorTokensListOriginal.forEach((colorToken) => {
            Object.assign(acc, colorToken);
          });
          return acc;
        }, {})
      })
    )
  }

  updateThemeTokens(): void {
    this.requestCustomTheme()
      .subscribe(tokens => {
        console.log(tokens);
        this.themeManager.varsCacheProxy = Object.assign(this.themeManager.varsCacheProxy, tokens);
      });
  }

}
