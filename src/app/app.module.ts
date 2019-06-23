import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BooksComponent } from './books/books.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { EditbookComponent } from './editbook/editbook.component';
import { ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';
import { FakeHttpClientProvider } from './fake-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    BooksComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    EditbookComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,   
    NgbModule, 
    MDBBootstrapModule.forRoot()
  ],
  entryComponents: [ EditbookComponent ],
  providers: [
    DatePipe
    ,FakeHttpClientProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
