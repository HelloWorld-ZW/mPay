import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';
import { CommunicationProvider } from '../../providers/communication/communication';
import { CryptographyProvider } from '../../providers/cryptography/cryptography';
import { HelperProvider } from '../../providers/helper/helper';
import { ServicesProvider } from '../../providers/services/services';
import { CryptoProvider } from '../../providers/crypto/crypto';

import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loader: any;
  login_email: string = 'zhen446@hotmail.com';
  login_password: string = 'Zhen..11';

  loginedData: any;

  publicKey: any;
  sessKey: any;
  sessIv: any;

  fingerprintLogin: any = false;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public communication: CommunicationProvider,
    public toastCtrl: ToastController,
    public cryptography: CryptographyProvider,
    public helper: HelperProvider,
    public services: ServicesProvider,
    public crypto: CryptoProvider,
    private fingerprint: FingerprintAIO,
    private platform: Platform
  ) {

    setInterval(() => {
      //alert("hello");
    }, 5000);


    this.checkIsAvailable();

    // this.platform.ready().then(() => {

    //   this.fingerprint.isAvailable().then((data) => {
    //     // this.helper.checkFile("settings.json")
    //     //   .then((bl) => {
    //     //     alert(bl);
    //     //     //this.fingerprintLogin = true;
    //     //   })
    //     //   .catch((err) => {
    //     //     alert(err);
    //     //     //this.fingerprintLogin = false;
    //     //   });
    //   })
    //     .catch((err) => {
    //       alert(err);
    //     })

    // });

  } //end constractor

  ionViewDidLoad() {

  }

  /////////////////////////////////////////////////////////////

  submitLogin() {

    this.helper.readFile("sessionKey.json").then((data) => {

      let sessionKey = JSON.parse(data);

      var loginCipher = this.crypto.AESEncypto(JSON.stringify({
        "email": this.login_email,
        "password": this.cryptography.Sha256Hash(this.login_password).toString()
      }), sessionKey.key, sessionKey.iv);

      this.helper.readFile("publicKey.json").then((pbk) => {
        let pbkJson = JSON.parse(pbk);
        var uuid_cipher = this.crypto.RSAEncypto(JSON.parse(this.helper.getDeviceInfo()).uuid + "", pbkJson.pbk);

        var uuid_login_cipher = JSON.stringify({
          "uuid": uuid_cipher,
          "data": loginCipher
        });

        this.loginReturn(uuid_login_cipher);

        this.publicKey = pbkJson.pbk;
        this.sessKey = sessionKey.key;
        this.sessIv = sessionKey.iv;
      })

    });

    /*
    /////////////////////////////////////////////////////////////////////
    var loginCipher = this.cryptography.AESEnc(JSON.stringify({
      "email": this.login_email,
      "password": this.cryptography.Sha256Hash(this.login_password).toString()
    }));
    var uuid_cipher = this.cryptography.RSAEnc(JSON.parse(this.helper.getDeviceInfo()).uuid+"");

    var uuid_login_cipher = JSON.stringify({
      "uuid": uuid_cipher,
      "data": loginCipher
    });
    
    this.loginReturn(uuid_login_cipher);
    console.log(uuid_login_cipher);
    */
  }

  async loginReturn(cipher: any) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    let response = await this.services.doPOST("mpay/account/signin", cipher).then(data => { return data; });
    loading.dismiss();

    let responseJson = JSON.parse(response.toString());

    if (responseJson.response == 1) {
      //nav to home page

      this.helper.readFile("sessionKey.json").then((data) => {

        let sessionKey = JSON.parse(data);
        //alert(sessionKey.key);

        let navPar = JSON.parse(this.crypto.AESDecypto(responseJson.accountInfo, sessionKey.key, sessionKey.iv));
        navPar['pbk'] = this.publicKey;
        navPar['sessKey'] = this.sessKey;
        navPar['sessIv'] = this.sessIv;

        this.navCtrl.setRoot(TabsPage, navPar);
      });
    }
    else {
      let toast = this.toastCtrl.create({
        message: responseJson.response,
        duration: 3000,
        position: 'top'
      });
      toast.present(toast);
    }
  }


  signup() {
    this.navCtrl.push(SignupPage);
  }

  async checkIsAvailable() {
    try{

      await this.platform.ready();
      const isAvailable = await this.fingerprint.isAvailable();
      if(isAvailable=="Available"){
        const isFileExist = await this.helper.checkFile("settings.json");
        if(isFileExist){
          this.helper.readFile("settings.json").then((data)=>{
            
            let settings = JSON.parse(data);
            //let settingEmail = settings.email;
            //let settingPassword = settings.password;
            //let settingFpPayment = settings.payment;
            let settingFpLogin = settings.login;
            if(settingFpLogin==1){
              this.fingerprintLogin = true;
            }
          });
        }
      }

    }catch(e){
      this.fingerprintLogin = false;
    }
    
  }

  showFingerprint(){
    this.fingerprint.show({
      clientId: 'Login: '+ this.login_email,
      localizedFallbackTitle: 'Use Pin', //Only for iOS
      localizedReason: 'Login: '+ this.login_email //Only for iOS
    })
      .then((result: any) => console.log(result))
      .catch((error: any) => console.log(error));
  }

}
