import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClassficationComponent } from './classfication/classfication.component';
import { ExtractionComponent } from './extraction/extraction.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ClassficationComponent,
    ExtractionComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    PdfViewerModule,
    RouterModule.forRoot([
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'classification',
        component: ClassficationComponent
      },
      {
        path: 'extraction',
        component: ExtractionComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home'
      },
      {
        path: '**',
        component: HomeComponent
      }
    ], {useHash: false}),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
