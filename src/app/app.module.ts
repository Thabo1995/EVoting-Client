import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DetailsComponent } from './voter/details/details.component';
import { VoteComponent } from './vote/vote/vote.component';
import { ResultsComponent } from './vote/results/results.component';
import { NavComponent } from './shared/nav/nav.component';
import { FooterComponent } from './shared/footer/footer.component';
import { BannerComponent } from './home/banner/banner.component';
import { TimelineComponent } from './home/timeline/timeline.component';
import { VotingStatusComponent } from './home/voting-status/voting-status.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DetailsComponent,
    VoteComponent,
    ResultsComponent,
    NavComponent,
    FooterComponent,
    BannerComponent,
    TimelineComponent,
    VotingStatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken',
     }
    ),
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
