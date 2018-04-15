import { Component } from '@angular/core';
import { NavController, NavParams, Events, ToastController } from 'ionic-angular';

import { HelperProvider } from '../../providers/helper/helper';
import { ServicesProvider } from '../../providers/services/services';
import { CryptoProvider } from '../../providers/crypto/crypto';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {


  fpLogin:any;
  fpPay:any;
  email:any;
  password:any;

  pbk: any;
  sessKey: any;
  sessIv: any;


  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public helper: HelperProvider,
    public services: ServicesProvider,
    public crypto: CryptoProvider,
    public event:Events,
    public toastCtrl: ToastController
  ) {

    this.fpPay = navParams.get("fpPay");
    this.fpLogin = navParams.get("fpLogin");
    this.email = navParams.get("email");
    this.password = navParams.get("password");
    
    this.pbk = navParams.get("pbk");
    this.sessKey = navParams.get("sessKey");
    this.sessIv = navParams.get("sessIv");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  async fp_login(event){
    //this.helper.createFile("settings.json");
    this.fpLogin = event.checked;
    let fileExist =  await this.helper.checkFile("settings.json");

    let settingInfo = JSON.stringify({
      email: this.email,
      password: this.password,
      fpLogin: this.fpLogin,
      fpPay:this.fpPay
    });

    if(fileExist)
      await this.helper.writeFile("settings.json", settingInfo);
    else{
      await this.helper.createFile("settings.json");
      await this.helper.writeFile("settings.json", settingInfo);
    }

    this.updateSettings();
  }

  async fp_pay(event){
    //this.helper.createFile("settings.json");
    this.fpPay = event.checked;
    let fileExist =  await this.helper.checkFile("settings.json");

    let settingInfo = JSON.stringify({
      email: this.email,
      password: this.password,
      fpLogin: this.fpLogin,
      fpPay:this.fpPay
    });

    if(fileExist)
      await this.helper.writeFile("settings.json", settingInfo);
    else{
      await this.helper.createFile("settings.json");
      await this.helper.writeFile("settings.json", settingInfo);
    }

    this.updateSettings();
  }

  async updateSettings(){
    let uuid_cipher = this.crypto.RSAEncypto(this.helper.getDeviceUUID()+"", this.pbk);
    let updateInfo = JSON.stringify({
      'email': this.email,
      'fpLogin': this.fpLogin,
      'fpPay': this.fpPay
    });

    let info_cipher = this.crypto.AESEncypto(updateInfo, this.sessKey, this.sessIv);
    let postData = JSON.stringify({
      'uuid': uuid_cipher,
      'data': info_cipher
    });

    this.services.doPOST("mpay/account/updateSettings", postData).then((response)=>{
      let responseJson = JSON.parse(response.toString());
      if(responseJson.response!=1)
      {
        let toast = this.toastCtrl.create({
          message: responseJson.response,
          duration: 2500,
          position: 'top'
        });

        toast.present();
      }
    });
  }

}
