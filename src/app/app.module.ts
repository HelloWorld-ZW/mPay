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

@NgModule({
  declarations: [
    mPay,
    HomePage,
    HistoryPage,
    FriendsPage,
    TabsPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(mPay)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    mPay,
    HomePage,
    HistoryPage,
    FriendsPage,
    TabsPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
