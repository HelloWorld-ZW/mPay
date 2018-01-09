import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import { CommunicationProvider } from '../../providers/communication/communication';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loader:any;
  login_email:string;
  login_password:string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingCtrl:LoadingController,
    public communication:CommunicationProvider
  ) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
  }

  _onLoginPress(){
    this.presentLoading();
    //console.log(this.login_email, this.login_password);
    //setTimeout( ()=>{
    
    this.communication.doAccountSignIn(this.login_email,this.login_password);

    this.navCtrl.setRoot(TabsPage);
    this.loader.dismiss();
    //}, 3000);
    
  }

  presentLoading(){
    this.loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content:"Login..."
    });
    this.loader.present();
  }
}
