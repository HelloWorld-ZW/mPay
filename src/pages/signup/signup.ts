import { Component, Directive } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgModel } from '@angular/forms';
import { HandleSignupProvider } from '../../providers/handle-signup/handle-signup';

import { CryptographyProvider } from '../../providers/cryptography/cryptography';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  nameLabel:any=" Full name";
  nameIcon:any="md-person";

  fullname:string;
  email:string;
  phone:string;
  password:string;
  type:string="personal";



  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public signupProvider:HandleSignupProvider, public cryptographyProvider:CryptographyProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  _onNextPress(){
    //alert(this.fullname+"\n"+this.email+"\n"+this.phone+"\n"+this.password);
    //alert("TODO: Send email verification code");

    //alert(this.signupProvider.doAccountSignUp(this.email, this.fullname, this.phone, this.password, this.type));
    
    
    //this.signupReturns(); //DO NOT Delete

    //this.cryptographyProvider.getPbk();

    this.cryptographyProvider.getPbk();
    //this.cryptographyProvider.sentSymmetricKeyToServer();

  }

  async signupReturns(){
    const info = await this.signupProvider.doAccountSignUp(this.email, this.fullname, this.phone, this.password, this.type).then(data=>{return data;});
    console.log(info);
    alert(info['status']);
  }

  onTypeChange(selectedValue: any){
    
    if(selectedValue=="business"){
      this.nameLabel = " Business Name";
      this.nameIcon = "ios-stats";
    }
    else{
      this.nameLabel = " Full Name";
      this.nameIcon = "md-person";
    }
  }
}
