import { Component } from '@angular/core';
import {
  NavController, NavParams, ModalController, ViewController,
  AlertController, LoadingController, Events
} from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { CryptoProvider } from '../../providers/crypto/crypto';
import { HelperProvider } from '../../providers/helper/helper';


@Component({
  selector: 'page-topup-withdraw-modal',
  templateUrl: 'topup-withdraw-modal.html',
})
export class TopupWithdrawModalPage {

  title: any;
  type: string;
  selectedCard: any = null;
  cards: any;
  inputMoney: any = null;;
  balance: any;
  email: any;

  pbk: any;
  sessKey: any;
  sessIv: any;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public services: ServicesProvider,
    public crypto: CryptoProvider,
    public helper: HelperProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public event: Events
  ) {
    this.type = this.navParams.get('type');
    this.cards = this.navParams.get('cards');
    this.balance = this.navParams.get('balance');
    this.email = this.navParams.get('email');
    this.pbk = navParams.get("pbk");
    this.sessKey = navParams.get("sessKey");
    this.sessIv = navParams.get("sessIv");


    switch (this.type) {
      case "Topup":
        this.title = this.type + " Account";
        break;
      case "Withdraw":
        this.title = this.type + " Money";
        break;
    }

    this.event.subscribe("returnToLogin", () => {
      this.dismiss();
    });
  }

  ionViewDidLoad() {
    (this.cards).forEach(acard => {
      if (acard.hidedNum.toString().length === 19) {
        acard.hidedNum = acard.hidedNum.toString().substring(15, 19);
      }
      switch (acard.CardNum.toString().substring(0, 1)) {
        case "4":
          acard.cardType = "Visa";
          break;
        case "5":
          acard.cardType = "Master";
          break;
      }
    });
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  onChange() {
    //this.inputMoney = this.inputMoney.replace(/,/g , ".");
    setTimeout(() => {
      if (this.type == 'Withdraw') {
        if (parseFloat(this.inputMoney) > parseFloat(this.balance)) {
          this.inputMoney = this.balance;
        }
      }
    }, 300);
  }

  onSubmit() {

    if (this.selectedCard == null) {
      let alert = this.alertCtrl.create({
        title: 'No Card Selected',
        subTitle: 'Please select a card to continue!',
        buttons: ['Ok']
      });
      alert.present();
    }

    else if (this.inputMoney == null) {
      let alert = this.alertCtrl.create({
        title: 'No amount Entered',
        subTitle: 'Please enter ' + this.type + ' amount to continue!',
        buttons: ['Ok']
      });
      alert.present();
    }
    else if (parseFloat(this.inputMoney) < 0.01) {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Cannot '+this.type+' less than 0.01',
        buttons: ['Ok']
      });
      alert.present();
    }

    else {
      // let loading = this.loadingCtrl.create({
      //   content: 'Processing...'
      // });

      //loading.present();

      setTimeout(() => {
        let info = JSON.stringify({
          "card": this.selectedCard,
          "amount": parseFloat(this.inputMoney),
          "email": this.email
        });
        let uuid = this.helper.getDeviceUUID() + "";
        let infoCipher = this.crypto.AESEncypto(info, this.sessKey, this.sessIv);
        let uuidCipher = this.crypto.RSAEncypto(uuid, this.pbk);

        let postData = JSON.stringify({
          "uuid": uuidCipher,
          "cipher": infoCipher
        });

        switch (this.type) {
          case "Topup":
            this.services.doPOST("mpay/tpwd/topup", postData).then((response) => {
              let responseJson = JSON.parse(response.toString());
              if (responseJson.response == 1) {
                this.balance = this.crypto.AESDecypto(responseJson.balance, this.sessKey, this.sessIv);
                
                this.event.publish("updateBalance", this.balance);
                this.event.publish("updateHistory");

                let alert = this.alertCtrl.create({
                  title: 'Topup Successfully',
                  buttons: ['OK']
                });
                alert.present();

                this.dismiss();
              }
              else {
                let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: responseJson.response,
                  buttons: ['OK']
                });
                alert.present();
              }
            });
            break;
          case "Withdraw":
            this.services.doPOST("mpay/tpwd/withdraw", postData).then((response)=>{
              let responseJson = JSON.parse(response.toString());
              if (responseJson.response == 1) {
                this.balance = this.crypto.AESDecypto(responseJson.balance, this.sessKey, this.sessIv);
                
                this.event.publish("updateBalance", this.balance);
                this.event.publish("updateHistory");

                let alert = this.alertCtrl.create({
                  title: 'Withdraw Successfully',
                  buttons: ['OK']
                });
                alert.present();

                this.dismiss();
              }
              else {
                let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: responseJson.response,
                  buttons: ['OK']
                });
                alert.present();
              }
            });
            break;
        }
      }, 500);


      //loading.dismiss();
    }
  }



}
