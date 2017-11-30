import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { LandingPage } from '../pages/landing/landing';
import { CommunicationProvider } from '../providers/communication/communication';
import { HelperProvider } from '../providers/helper/helper';

@Component({
  templateUrl: 'app.html'
})
export class mPay {
  rootPage:any = LandingPage;

  constructor(platform: Platform, statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    private communication:CommunicationProvider,
    private helper:HelperProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      
      this.communication.getPbkFromServer();

      setTimeout( ()=>{ 
         this.helper.EncAndPostData();
      }, 500);
     
    });
  }
}

