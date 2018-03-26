import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { LandingPage } from '../pages/landing/landing';
import { CardsPage } from '../pages/cards/cards';
import { CommunicationProvider } from '../providers/communication/communication';
import { HelperProvider } from '../providers/helper/helper';
import { ServicesProvider } from '../providers/services/services';
import { CryptographyProvider } from '../providers/cryptography/cryptography';

@Component({
  templateUrl: 'app.html'
})
export class mPay {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    private communication:CommunicationProvider,
    private services:ServicesProvider,
    private helper:HelperProvider,
    private crypto:CryptographyProvider) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      
      // this.communication.getPbkFromServer();////////////////////////
      try {
        //get server pbk and save to local storage
        this.services.getServerPBK();
        
        //get device info 
        var deviceInfo = JSON.parse(this.helper.getDeviceInfo());

        //gererate session key and iv
        var sessionKey = JSON.parse(this.helper.generateSessionKey());

        //save key and iv to local storage
        this.helper.setStorageData("sessKey",sessionKey.key);
        this.helper.setStorageData("sessIv", sessionKey.iv);

        var dInfo_key = deviceInfo;
        dInfo_key['sessKey'] = sessionKey.key;
        dInfo_key['sessIv'] = sessionKey.iv;

        setTimeout( ()=>{ 
          var cipher = this.crypto.RSAEnc(JSON.stringify(dInfo_key));
          this.services.doPOST("mpay/device/create_update", cipher);
          console.log(cipher);
        },1500);
        

        
      } catch (error) {
        alert(error);
      }
      
      setTimeout( ()=>{ 
        this.services.test();
         //this.helper.EncAndPostDeviceInfoAndSymmetricKey();

        //this.communication.postDeviceInfoAndSymmetricKey();
      }, 500);
     
    });
  }
}

