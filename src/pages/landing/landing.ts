import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { SignupPage } from '../../pages/signup/signup';


@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');
  }

  _onSigninPress(){
    this.navCtrl.push(LoginPage);
  }

  _onSignupPress(){
    this.navCtrl.push(SignupPage);
  }
}
