import { Component, Directive } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { NgModel, Validators, FormControl, FormBuilder, FormGroup, ValidatorFn,AbstractControl } from '@angular/forms';
import { HandleSignupProvider } from '../../providers/handle-signup/handle-signup';

import { CryptographyProvider } from '../../providers/cryptography/cryptography';
import { CommunicationProvider } from '../../providers/communication/communication';
import { ServicesProvider } from '../../providers/services/services';
import { HelperProvider } from '../../providers/helper/helper';

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

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public signupProvider:HandleSignupProvider, 
    public cryptographyProvider:CryptographyProvider,
    public communication:CommunicationProvider, 
    public formBuilder: FormBuilder,
    public services:ServicesProvider, 
    public helper: HelperProvider,
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController) {


      this.formGroup = this.formBuilder.group({
        username:['', Validators.compose([Validators.required, Validators.pattern('^(?:[A-Za-z0-9 ]*)$')])],
        //letters, numbers and spaces only
        email: ['', Validators.compose([Validators.maxLength(70), Validators.required,
          Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
        // email regex
        phone:['',  Validators.compose([Validators.required, Validators.minLength(10),Validators.maxLength(10), 
          Validators.pattern('08([0-9]{8,8})')])],
          // digits onbly, start from 08 and rest 8 digits 
        password: new FormControl('', Validators.compose([Validators.required, 
          Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')])),
        //Minimum eight characters, at least one uppercase letter, one lowercase letter, one number:
        re_password: new FormControl('', [Validators.required, this.equalto('password')]),

        type:'1'
      });

  }

  ionViewDidLoad() {
    // on view load
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
    var signupData = this.formGroup.value;
    var passworh_hash = this.cryptographyProvider.Sha256Hash(this.formGroup.value.password);
    signupData.password = passworh_hash.toString();
    delete signupData['re_password'];

    var signUp_cipher = this.cryptographyProvider.AESEnc(JSON.stringify(signupData));
    var uuid_cipher = this.cryptographyProvider.RSAEnc(JSON.parse(this.helper.getDeviceInfo()).uuid+"");
    var signup_uuid_cipher = JSON.stringify({
      "uuid":uuid_cipher,
      "data": signUp_cipher
    });


    //console.log("uuid:"+JSON.parse(this.helper.getDeviceInfo()).uuid);

    //console.log(signup_uuid_cipher);

    
    this.signupReturns(signup_uuid_cipher);
    

  }
  async signupReturns(cipher:any){
    //loading
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    let response = await this.services.doPOST("mpay/account/signup",cipher).then(data=>{return data;});
    loading.dismiss();

    let responseJson = JSON.parse(response.toString());

    if(responseJson.response==1){
      let alert = this.alertCtrl.create({
        title: 'Account Registered',
        subTitle: 'Your account is registered successfully, An activation link is send to your email!',
        buttons: [{
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }]
      });
      alert.present();
    }
    else{
      let alert = this.alertCtrl.create({
        title: 'ERROR',
        subTitle: responseJson.response,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  onTypeChange(selectedValue: any){
    if(selectedValue=="2"){
      this.nameLabel = "Busin.Name";
    }
    else{
      this.nameLabel = "Username";
    }
  }
}
