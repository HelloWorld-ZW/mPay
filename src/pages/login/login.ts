import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';
import { CommunicationProvider } from '../../providers/communication/communication';
import { CryptographyProvider } from '../../providers/cryptography/cryptography';
import { HelperProvider } from '../../providers/helper/helper';
import { ServicesProvider } from '../../providers/services/services';
import { CryptoProvider } from '../../providers/crypto/crypto';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loader:any;
  login_email:string;
  login_password:string;

  loginedData:any;

  publicKey:any;
  sessKey:any;
  sessIv:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingCtrl:LoadingController,
    public communication:CommunicationProvider,
    public toastCtrl: ToastController,
    public cryptography:CryptographyProvider,
    public helper: HelperProvider,
    public services: ServicesProvider,
    public crypto: CryptoProvider) {

    setInterval(()=>{
      //alert("hello");
    },5000);

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
  }

  /////////////////////////////////////////////////////////////

  submitLogin(){

    this.helper.readFile("sessionKey.json").then((data)=>{
      
      let sessionKey = JSON.parse(data);

      var loginCipher = this.crypto.AESEncypto(JSON.stringify({
        "email": this.login_email,
        "password": this.cryptography.Sha256Hash(this.login_password).toString()
      }), sessionKey.key, sessionKey.iv);

      this.helper.readFile("publicKey.json").then((pbk)=>{
        let pbkJson = JSON.parse(pbk);
        var uuid_cipher = this.crypto.RSAEncypto(JSON.parse(this.helper.getDeviceInfo()).uuid+"",pbkJson.pbk);

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

  async loginReturn(cipher:any){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    let response = await this.services.doPOST("mpay/account/signin",cipher).then(data=>{return data;});
    loading.dismiss();

    let responseJson = JSON.parse(response.toString());

    if(responseJson.response==1){
      //nav to home page
      
      this.helper.readFile("sessionKey.json").then((data)=>{
        
        let sessionKey = JSON.parse(data);
        //alert(sessionKey.key);

        let navPar = JSON.parse(this.crypto.AESDecypto(responseJson.accountInfo, sessionKey.key, sessionKey.iv));
        navPar['pbk'] = this.publicKey;
        navPar['sessKey'] = this.sessKey;
        navPar['sessIv'] = this.sessIv;

        this.navCtrl.setRoot(TabsPage, navPar);
      });
    }
    else{
      let toast = this.toastCtrl.create({
        message: responseJson.response,
        duration: 3000,
        position: 'top'
      });
      toast.present(toast);
    }
  }


  signup(){
    this.navCtrl.push(SignupPage);
  }
}
