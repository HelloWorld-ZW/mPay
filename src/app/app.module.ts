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
import { CardPage } from '../pages/card/card';
import { AddcardPage } from '../pages/addcard/addcard';
import { HistoryModalPage } from '../pages/history-modal/history-modal';
import { TopupWithdrawModalPage } from '../pages/topup-withdraw-modal/topup-withdraw-modal';
import { SettingsPage } from '../pages/settings/settings';
import { SendMoneyPage } from '../pages/send-money/send-money';

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
import { CryptoProvider } from '../providers/crypto/crypto';
import { File } from '@ionic-native/file';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';



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
    CardPage,
    AddcardPage,
    HistoryModalPage,
    TopupWithdrawModalPage,
    SettingsPage,
    SendMoneyPage
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
    CardPage,
    AddcardPage,
    HistoryModalPage,
    TopupWithdrawModalPage,
    SettingsPage,
    SendMoneyPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HandleSignupProvider,
    CryptographyProvider,
    HelperProvider,
    Device,
    ZBar,
    CommunicationProvider,
    ServicesProvider,
    CryptoProvider,
    File,
    FingerprintAIO
  ]
})
export class AppModule {}
