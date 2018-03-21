import { Component, Directive } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgModel, Validators, FormControl, FormBuilder, FormGroup, ValidatorFn,AbstractControl } from '@angular/forms';
import { HandleSignupProvider } from '../../providers/handle-signup/handle-signup';

import { CryptographyProvider } from '../../providers/cryptography/cryptography';
import { CommunicationProvider } from '../../providers/communication/communication';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  nameLabel:any="Username";

  // username:string;
  // email:string;
  // phone:string;
  // password:string;
  // conf_password:string;
  // type:string="personal";

  // newSignUp = {
  //   username:'',
  //   emial:'',
  //   phone:'',
  //   password:'',
  //   conf_password:'',
  //   type:'personal'
  // };


  private formGroup : FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public signupProvider:HandleSignupProvider, public cryptographyProvider:CryptographyProvider,
    public communication:CommunicationProvider, public formBuilder: FormBuilder) {

      this.formGroup = this.formBuilder.group({
        username:['', Validators.compose([Validators.required, Validators.pattern('^(?:[A-Za-z]+)(?:[A-Za-z0-9 ]*)$')])],
        email: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])],
        phone:['', Validators.required],

        password: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')])),
        //Minimum eight characters, at least one uppercase letter, one lowercase letter, one number:
        re_password: new FormControl('', [Validators.required, this.equalto('password')]),
        type:'personal'
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  equalto(field_name): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
    
      let input = control.value;
      
      let isValid=control.root.value[field_name]==input
      if(!isValid) 
        return { 'equalTo': {isValid} }
      else 
        return null;
    };
  }

  submitSignUp(){
    console.log(this.formGroup.value);
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
