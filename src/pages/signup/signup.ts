import { Component, Directive } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgModel } from '@angular/forms';


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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      //<ion-icon name="md-person"></ion-icon> Full name<
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  _onNextPress(){
    alert(this.fullname+"\n"+this.email+"\n"+this.phone+"\n"+this.password);
    alert("TODO: Send email verification code");
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
