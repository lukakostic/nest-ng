import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';

import { UserService } from './user/user.service';

import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './page-login/login/login.component';
import { RegisterComponent } from './page-login/register/register.component';

import { PageMainComponent } from './page-main/page-main.component';
import { PageLoginComponent } from './page-login/page-login.component';
import { PageAccountComponent } from './page-account/page-account.component';

import { PostComponent } from './post/post.component';
import { CommentComponent } from './comment/comment.component';
import { FeedComponent } from './page-main/feed/feed.component';
import { CreatorComponent } from './page-main/creator/creator.component';

import { postFeatureKey, postReducer } from './post/post.reducer';
import { PostService, PostEffects } from './post/post.effects';
import { AuthEffects } from './user/user.effects';
import { authReducer } from './user/user.reducer';
import { AllFeedComponent } from './page-main/all-feed/all-feed.component';

import {MatMenuModule} from '@angular/material/menu';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PagePostComponent } from './page-post/page-post.component';
import { LetDirective } from '@ngrx/component';
import { CommentCreatorComponent } from './comment-creator/comment-creator.component';
import { VoteService } from './user/vote.service';
import { CommentService } from './comment/comment.service';

const routes: Routes = [
  { path: '', component: PageMainComponent },
  { path: 'login', component: PageLoginComponent },
  { path: 'user', component: PageMainComponent },
  { path: 'post', component: PageMainComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PageMainComponent,
    PageLoginComponent,
    PageAccountComponent,
    PostComponent,
    CommentComponent,
    FeedComponent,
    CreatorComponent,
    AllFeedComponent,
    PagePostComponent,
    CommentCreatorComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ 'feed': postReducer, 'auth': authReducer }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([PostEffects,AuthEffects]),
    BrowserAnimationsModule,
    MatMenuModule,MatIconModule,MatButtonModule,
    LetDirective
  ],
  providers: [UserService,PostService,VoteService,CommentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
