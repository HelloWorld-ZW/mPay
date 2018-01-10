import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import { CommunicationProvider } from '../../providers/communication/communication';
import { CryptographyProvider } from '../../providers/cryptography/cryptography';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loader:any;
  login_email:string;
  login_password:string;

  loginedData:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingCtrl:LoadingController,
    public communication:CommunicationProvider,
    public toastCtrl: ToastController,
    public cryptography:CryptographyProvider
  ) {

    setInterval(()=>{
      //alert("hello");
    },5000);

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
  }

  _onLoginPress(){
    this.presentLoading();
    //console.log(this.login_email, this.login_password);
    setTimeout( ()=>{
    
    this.doAccountLogin();

    //var a = this.communication.doAccountSignIn(this.login_email,this.login_password);

    
    this.loader.dismiss();
    }, 3000);
    
  }

  doAccountLogin(){
    this.communication.doAccountSignIn(this.login_email,this.login_password).then(
      (result)=>{
        //console.log(result);
        if(result=="false"){
          let toast = this.toastCtrl.create({
            message: 'Wrong email address or password !',
            duration: 3000,
            position: 'top'
          });
          toast.present(toast);
        }
        else{
          //do decript
          var jsonSTR = this.cryptography.AESDecryption(result.toString());
          console.log(jsonSTR);
          this.navCtrl.setRoot(TabsPage, JSON.parse(jsonSTR));
        }
        
      },
      (err)=>{
        console.log(err);
      });
  }

  presentLoading(){
    this.loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content:"Login..."
    });
    this.loader.present();
  }
}
