import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loader:any;
  login_email:String;
  login_password:String;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl:LoadingController,) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
  }

  _loginBtn_press(){
    this.presentLoading();
    //console.log(this.login_email, this.login_password);
    setTimeout( ()=>{ 
      this.navCtrl.setRoot(TabsPage);
      this.loader.dismiss();
    }, 3000);
    
  }

  presentLoading(){
    this.loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content:"Login..."
    });
    this.loader.present();
  }
}
