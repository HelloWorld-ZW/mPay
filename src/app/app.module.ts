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
import { CardsPage } from '../pages/cards/cards';
import { AddcardPage } from '../pages/addcard/addcard';

import { HandleSignupProvider } from '../providers/handle-signup/handle-signup';

import { HttpModule } from '@angular/http';
import { CryptographyProvider } from '../providers/cryptography/cryptography';
import { IonicStorageModule } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { HelperProvider } from '../providers/helper/helper';
import { CommunicationProvider } from '../providers/communication/communication';
import { ZBar } from '@ionic-native/zbar';
import { ServicesProvider } from '../providers/services/services';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    mPay,
    HomePage,
    HistoryPage,
    FriendsPage,
    TabsPage,
    LoginPage,
    LandingPage,
    SignupPage,
    CardsPage,
    AddcardPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(mPay),
    HttpModule,
    BrMaskerModule,
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
    SignupPage,
    CardsPage,
    AddcardPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HandleSignupProvider,
    CryptographyProvider,
    HelperProvider,
    Device,
    ZBar,
    CommunicationProvider,
    ServicesProvider
  ]
})
export class AppModule {}
