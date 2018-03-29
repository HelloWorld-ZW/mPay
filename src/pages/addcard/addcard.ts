import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { NgModel, Validators, FormControl, FormBuilder, FormGroup, ValidatorFn,AbstractControl } from '@angular/forms';
import { CryptographyProvider } from '../../providers/cryptography/cryptography';
import { ServicesProvider } from '../../providers/services/services';
import { HelperProvider } from '../../providers/helper/helper';



@Component({
  selector: 'page-addcard',
  templateUrl: 'addcard.html',
})
export class AddcardPage {

  expDate:any = "01/2018"
  visa_img:any="/assets/imgs/visa_credit_nocolor.png";
  //visa_debit_img:any="/assets/imgs/visa_debit_nocolor.png";
  master_img:any="/assets/imgs/master_nocolor.png";
  minYear:any=(new Date()).getFullYear();
  maxYear:any=(new Date()).getFullYear()+10;

  email:any;

  private cardForm : FormGroup;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public helper: HelperProvider,
    public crypto: CryptographyProvider,
    public services: ServicesProvider,
    public toastCtrl: ToastController) {

      this.cardForm = this.formBuilder.group({
        cardNum:['', Validators.compose([Validators.required, Validators.pattern('([0-9 ]{19,})')])],
        holder:['', Validators.compose([Validators.required, Validators.pattern('^(?:[A-Za-z \']*)$')])],
        expiry:['', Validators.compose([Validators.required])],
        cvv:['', Validators.compose([Validators.required, Validators.pattern('([0-9]{3,})')])]

      });

      this.email = this.helper.getStorageData("loggedIn");
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AddcardPage');
  }

  onCardNumChange(card_num){
    let is_valid = false;
    if(card_num.length==19){
      is_valid = this.helper.cardValidate(card_num);
    }
    else{
      is_valid=false;
    }
    
    if(is_valid){
      switch(parseInt(card_num.substring(0,card_num.length-(card_num.length-1)))){
        case 4:
          this.visa_img="/assets/imgs/visa_credit_color.png";
          break;
        case 5:
          this.master_img="/assets/imgs/master_color.png";
          break;
      }
    }
    else{
      switch(parseInt(card_num.substring(0,card_num.length-(card_num.length-1)))){
        case 4:
          this.visa_img="/assets/imgs/visa_credit_nocolor.png";
          break;
        case 5:
          this.master_img="/assets/imgs/master_nocolor.png";
          break;
      }
    }
  }

  submitCardForm(){
    let cardNum, holder, year, month, cvv, expiryDM;

    expiryDM = this.cardForm.value.expiry.split("-");
    year = expiryDM[0];
    month = expiryDM[1];
    if(this.cardExpiryCheck(year,month)){
      cardNum = this.cardForm.value.cardNum.replace(/\s/g, '');
      holder = this.cardForm.value.holder;
      cvv = this.cardForm.value.cvv;

      let dataStr = JSON.stringify({
        "email":this.email.__zone_symbol__value,
        "cardNum": cardNum,
        "cardInfo": this.crypto.Sha256Hash(cardNum+holder+month+year+cvv).toString() //this.crypto.Sha256Hash(
      });
      let cipher = this.crypto.AESEnc(dataStr);
      let uuid = JSON.parse(this.helper.getDeviceInfo()).uuid;
      let data = JSON.stringify({
        "uuid":this.crypto.RSAEnc(uuid+""),
        "data": cipher
      });

      console.log(data);
    }
    else{
      let toast = this.toastCtrl.create({
        message: "ERROR: Card Expired",
        duration: 3000,
        position: 'top'
      });
      toast.present(toast);
    }
  }

  cardExpiryCheck(year, month){
    if(Number(year)>=(new Date()).getFullYear()){
      if(parseInt(month)>=(new Date()).getMonth()+1){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  }
  
  

}
