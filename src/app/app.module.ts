import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { DynamicFormQuestionComponent } from './galaktika/components/dynamic-form-question/dynamic-form-question.component';
// import { PerformanceComponent } from './performance/performance.component';
// import { TokensComponent } from './tokens/tokens.component';

@NgModule({
  declarations: [
    AppComponent,
    // DynamicFormQuestionComponent,
    // TokensComponent,
    // PerformanceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
