import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';

import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './page-login/login/login.component';
import { RegisterComponent } from './page-login/register/register.component';
import { AuthService } from './auth.service';
import { PageMainComponent } from './page-main/page-main.component';
import { PageLoginComponent } from './page-login/page-login.component';
import { PageAccountComponent } from './page-account/page-account.component';
import { InboxComponent } from './inbox/inbox.component';
import { PostComponent } from './post/post.component';
import { CommentComponent } from './comment/comment.component';
import { MessageComponent } from './message/message.component';
import { FeedComponent } from './feed/feed.component';
import { CreatorComponent } from './creator/creator.component';

import { postFeatureKey, postReducer } from './post.reducer';
import { PostEffects } from './post.effects';

const routes: Routes = [
  { path: '', component: PageMainComponent },
  { path: 'login', component: PageLoginComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PageMainComponent,
    PageLoginComponent,
    PageAccountComponent,
    InboxComponent,
    PostComponent,
    CommentComponent,
    MessageComponent,
    FeedComponent,
    CreatorComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ 'feed': postReducer }),
    //StoreModule.forRoot({}, {}),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([PostEffects])
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
