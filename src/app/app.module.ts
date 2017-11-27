import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { mPay } from './app.component';
import { HomePage } from '../pages/home/home';
import { FriendsPage } from '../pages/friends/friends';
import { HistoryPage } from '../pages/history/history';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { LandingPage } from '../pages/landing/landing';
import { SignupPage } from '../pages/signup/signup';
import { HandleSignupProvider } from '../providers/handle-signup/handle-signup';

import { HttpModule } from '@angular/http';
import { CryptographyProvider } from '../providers/cryptography/cryptography';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    mPay,
    HomePage,
    HistoryPage,
    FriendsPage,
    TabsPage,
    LoginPage,
    LandingPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(mPay),
    HttpModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    mPay,
    HomePage,
    HistoryPage,
    FriendsPage,
    TabsPage,
    LoginPage,
    LandingPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HandleSignupProvider,
    CryptographyProvider
  ]
})
export class AppModule {}
