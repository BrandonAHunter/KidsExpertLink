import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';

import { CreateIdeaPage } from '../pages/create-idea/create-idea';
import { IdeaDetailPage } from '../pages/idea-detail/idea-detail';
import { ProfilePage } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { SearchIdeaPage } from '../pages/search-idea/search-idea';
import { ViewIdeaPage } from '../pages/view-idea/view-idea';
import { ViewLinkedPage } from '../pages/view-linked/view-linked';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Data } from '../providers/data';

@NgModule({
  declarations: [
    MyApp,
    CreateIdeaPage,
    IdeaDetailPage,
    ProfilePage,
    TabsPage,
    SearchIdeaPage,
    ViewIdeaPage,
    ViewLinkedPage,
    SigninPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CreateIdeaPage,
    IdeaDetailPage,
    ProfilePage,
    TabsPage,
    SearchIdeaPage,
    ViewIdeaPage,
    ViewLinkedPage,
    SigninPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Data
  ]})
export class AppModule {}
