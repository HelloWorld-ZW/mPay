import { Component, Directive } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgModel } from '@angular/forms';
import { HandleSignupProvider } from '../../providers/handle-signup/handle-signup';

import { CryptographyProvider } from '../../providers/cryptography/cryptography';
import { CommunicationProvider } from '../../providers/communication/communication';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  nameLabel:any="Username";

  username:string;
  email:string;
  phone:string;
  password:string;
  conf_password:string;
  type:string="personal";



  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public signupProvider:HandleSignupProvider, public cryptographyProvider:CryptographyProvider,
    public communication:CommunicationProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  submitSignUp(){
    //DO submit signup 
  }

  async signupReturns(){
    //const info = await this.signupProvider.doAccountSignUp(this.email, this.fullname, this.phone, this.password, this.type).then(data=>{return data;});
    //console.log(info);
    //alert(info['status']);
  }

  onTypeChange(selectedValue: any){
    if(selectedValue=="business"){
      this.nameLabel = "Busin.Name";
    }
    else{
      this.nameLabel = "Username";
    }
  }
}
