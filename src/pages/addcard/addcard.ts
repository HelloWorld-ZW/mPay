import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, Events } from 'ionic-angular';
import { NgModel, Validators, FormControl, FormBuilder, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { CryptoProvider } from '../../providers/crypto/crypto';
import { ServicesProvider } from '../../providers/services/services';
import { HelperProvider } from '../../providers/helper/helper';



@Component({
  selector: 'page-addcard',
  templateUrl: 'addcard.html',
})
export class AddcardPage {

  expDate: any = "01/2018"
  visa_img: any = "assets/imgs/visa_credit_nocolor.png";
  //visa_debit_img:any="/assets/imgs/visa_debit_nocolor.png";
  master_img: any = "assets/imgs/master_nocolor.png";
  minYear: any = (new Date()).getFullYear();
  maxYear: any = (new Date()).getFullYear() + 10;

  email: any;
  pbk:any;
  sessKey:any;
  sessIv:any;


  private cardForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public helper: HelperProvider,
    public crypto: CryptoProvider,
    public services: ServicesProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public events:Events) {

    this.cardForm = this.formBuilder.group({
      cardNum: ['', Validators.compose([Validators.required, Validators.pattern('([0-9 ]{19,})')])],
      holder: ['', Validators.compose([Validators.required, Validators.pattern('^(?:[A-Za-z \']*)$')])],
      expiry: ['', Validators.compose([Validators.required])],
      cvv: ['', Validators.compose([Validators.required, Validators.pattern('([0-9]{3,})')])]

    });

    //this.email = this.helper.getStorageData("loggedIn");

    this.email = navParams.get("email");
    this.sessKey = navParams.get("sessKey");
    this.sessIv = navParams.get("sessIv");
    this.pbk = navParams.get("pbk");

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AddcardPage');
  }

  onCardNumChange(card_num) {
    let is_valid = false;
    if (card_num.length == 19) {
      is_valid = this.helper.cardValidate(card_num);
    }
    else {
      is_valid = false;
    }

    if (is_valid) {
      switch (parseInt(card_num.substring(0, card_num.length - (card_num.length - 1)))) {
        case 4:
          this.visa_img = "assets/imgs/visa_credit_color.png";
          break;
        case 5:
          this.master_img = "assets/imgs/master_color.png";
          break;
      }
    }
    else {
      switch (parseInt(card_num.substring(0, card_num.length - (card_num.length - 1)))) {
        case 4:
          this.visa_img = "assets/imgs/visa_credit_nocolor.png";
          break;
        case 5:
          this.master_img = "assets/imgs/master_nocolor.png";
          break;
      }
    }
  }

  submitCardForm() {
    let cardNum, holder, year, month, cvv, expiryDM;

    expiryDM = this.cardForm.value.expiry.split("-");
    year = expiryDM[0];
    month = expiryDM[1];
    if (this.cardExpiryCheck(year, month)) {
      cardNum = this.cardForm.value.cardNum.replace(/\s/g, '');
      holder = (this.cardForm.value.holder).toLowerCase();
      cvv = this.cardForm.value.cvv;

      let dataStr = JSON.stringify({
        "email": this.email,
        "cardNum": cardNum,
        "cardInfo": this.crypto.SHA256(cardNum + holder + month + year + cvv).toString() //this.crypto.Sha256Hash(
      });
      let cipher = this.crypto.AESEncypto(dataStr,this.sessKey, this.sessIv);
      let uuid = JSON.parse(this.helper.getDeviceInfo()).uuid;
      let data = JSON.stringify({
        "uuid": this.crypto.RSAEncypto(uuid + "", this.pbk),
        "data": cipher
      });

      //TODO: POST
      this.addCardReturns(data);
    }
    else {
      let toast = this.toastCtrl.create({
        message: "ERROR: Card Expired",
        duration: 3000,
        position: 'top'
      });
      toast.present(toast);
    }
  }

  async addCardReturns(cipher: any) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    let response = await this.services.doPOST("mpay/registercard/validate", cipher).then(data => { return data; });
    loading.dismiss();

    let responseJson = JSON.parse(response.toString());

    if (responseJson.response == 1) {
      let alert = this.alertCtrl.create({
        title: 'New Card Added',
        subTitle: 'Your Card is added successfully!',
        buttons: [{
          text: 'Ok',
          handler: () => {
            this.events.publish('reloadCards');
            this.navCtrl.pop();
          }
        }]
      });
      alert.present();
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'ERROR',
        subTitle: responseJson.response,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  cardExpiryCheck(year, month) {

    if (parseInt(month) >= (new Date()).getMonth() + 1) {
      return true;
    }
    else {
      if (Number(year) > (new Date()).getFullYear()) {
        return true;
      }
      else {
        return false;
      }
    }
  }



}
