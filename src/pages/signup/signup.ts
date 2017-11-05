import { Component, Directive } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';



@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
@Directive({
  selector: '[mask]'
})
export class SignupPage {

  fullname:string;
  email:string;
  phone:string;
  password:string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  _onNextPress(){
    alert(this.fullname+"\n"+this.email+"\n"+this.phone+"\n"+this.password);
    alert("TODO: Send email verification code");
  }
}
