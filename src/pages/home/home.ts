import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { LoadingController, AlertController, ToastController, ModalController, Platform } from 'ionic-angular';
import { CommunicationProvider } from '../../providers/communication/communication';
import { CardPage } from '../card/card';
import { ServicesProvider } from '../../providers/services/services';
import { CryptoProvider } from '../../providers/crypto/crypto';
import { HelperProvider } from '../../providers/helper/helper';
import { TopupWithdrawModalPage } from '../topup-withdraw-modal/topup-withdraw-modal';
import { HistoryModalPage } from '../history-modal/history-modal';
import { SendMoneyPage } from '../send-money/send-money';
import { LoginPage } from '../login/login';

import { Subscription } from 'rxjs';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  username: string;
  email: string;
  password: any;
  balance: any;
  ipAddress: string;
  passcode: string;

  fpLogin: any;
  fpPay: any;

  pbk: any;
  sessKey: any;
  sessIv: any;

  cards: any = new Array();

  transactions: any = new Array();
  pages: any = [CardPage];

  hasTransHistory: any;

  onResumeSubscription: Subscription;

  merchantName: any;
  amount: any;

  fpAvailable: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    public loading: LoadingController,
    public communication: CommunicationProvider,
    private alertCtrl: AlertController,
    public services: ServicesProvider,
    public crypto: CryptoProvider,
    public helper: HelperProvider,
    public toastCtrl: ToastController,
    public event: Events,
    public modalCtrl: ModalController,
    private fingerprint: FingerprintAIO,
    public platform: Platform
  ) {

    //console.log(navParams.data);
    this.username = navParams.get("username");
    this.email = navParams.get("email");
    this.password = navParams.get("password");
    this.balance = navParams.get("balance");
    this.passcode = navParams.get("passcode");

    this.pbk = navParams.get("pbk");
    this.sessKey = navParams.get("sessKey");
    this.sessIv = navParams.get("sessIv");
    //alert(navParams.get("pbk"));

    this.fpPay = navParams.get("fpPay");
    this.fpLogin = navParams.get("fpLogin");

    this.logHistory();

    this.loadTrans();

    this.loadCards();

    this.updateHistory();

    //this.realodCardListener();
    // this.event.subscribe('reloadCardsHome', (newCards) => {
    //   this.cards = newCards;
    //   //this.loadCards();
    // });

    this.writeSettingFile();

    setInterval(() => {
      this.loadTrans();
      this.updatingBalance();
      this.loadCards();
    }, 10000);


    this.onResumeSubscription = platform.resume.subscribe(() => {
      //this.navCtrl.setRoot(LoginPage);
      this.event.publish('returnToLogin');
    });


    this.checkFPAvailable();

    this.event.subscribe("updateSettings", () => {
      this.checkFPAvailable();
    });
  }

  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    this.onResumeSubscription.unsubscribe();
  }
  //constructor END

  _scan() {
    this.barcodeScanner.scan().then(data => {
      let loading = this.loading.create({
        content: 'Processing...'
      });
      loading.present();

      if (this.codeValidation(data.text)) {
        this.services.doPOST("mpay/transaction/getQrInfo", this.packTransCode(data.text))
          .then((response) => {
            //alert(response);
            let responseJson = JSON.parse(response + "");
            //alert("response: " + responseJson.response);
            if (responseJson.response == 1) {
              let plainStr = this.crypto.AESDecypto(responseJson.cipher, this.sessKey, this.sessIv);
              let plainJson = JSON.parse(plainStr);

              this.merchantName = plainJson.merchantName;
              this.amount = plainJson.amount;

              let alert = this.alertCtrl.create({
                title: 'Confirm Payment',
                subTitle: 'Merchant: ' + plainJson.merchantName + "<br/>Amount: " + plainJson.amount,
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel'
                  },
                  {
                    text: 'Pay',
                    handler: () => {
                      alert.dismiss();

                      if (this.balance < plainJson.amount) {
                        this.selectCardAlert(plainJson.merchantId, data.text);
                      }
                      else {

                        if (this.fpAvailable) {
                          this.showFingerprint(plainJson.merchantId, data.text, "");
                        }
                        else
                          this.passcodeAlert(plainJson.merchantId, data.text, "");
                        //this.checkIsAvailable(plainJson.merchantId, data.text, "");
                        //this.passcodeAlert(plainJson.merchantId, data.text, "");
                      }
                    }
                  }
                ]
              });
              alert.present();

            }
            else {
              alert("response err: " + responseJson.response);
            }

          });
      }
      else {
        alert("No such code " + data.text);
      }
      loading.dismiss();
    }).catch(err => {
      alert("error: " + err);
    });

  }
  // _scan END

  codeValidation(transCode: string) {
    let prifix = transCode.substr(0, 4);
    if (prifix == 'mpay')
      return true;
    else
      return false;
  }

  packTransCode(transCode: string) {
    let dataPack = JSON.stringify({
      "uuid": this.crypto.RSAEncypto(JSON.parse(this.helper.getDeviceInfo()).uuid + "", this.pbk),
      "code": this.crypto.RSAEncypto(transCode, this.pbk)
    });
    return dataPack;
  }


  paymentConfirmation(passcode, merchant, transCode, card) {

    try {
      let passcodeJson = JSON.stringify(passcode);

      let paymentInfo = {
        "passcode": passcode,
        "sender": this.email,
        "receiver": merchant,
        "transCode": transCode
      };

      if (card.toString().length > 0) {
        paymentInfo['card'] = card;
      }

      let uuid = JSON.parse(this.helper.getDeviceInfo()).uuid;
      let paymentInfoCipher = JSON.stringify({
        "uuid": this.crypto.RSAEncypto(uuid + "", this.pbk),
        "cipher": this.crypto.AESEncypto(JSON.stringify(paymentInfo), this.sessKey, this.sessIv)
      });

      this.transProcessReturns(paymentInfoCipher);
      //alert(paymentInfoCipher);
    } catch (e) {
      alert(e);
    }

  }

  async transProcessReturns(cipher) {
    let loading = this.loading.create({
      content: 'Processing...'
    });
    loading.present();

    this.services.doPOST("mpay/transaction/qrcodepayment", cipher).then((response) => {

      let responseJson = JSON.parse(response.toString());
      if (responseJson.response == 1) {
        try {
          let plainStr = this.crypto.AESDecypto(responseJson.cipher, this.sessKey, this.sessIv);
          let plainJson = JSON.parse(plainStr);
          this.balance = plainJson.balance;
          this.event.publish("updateBalance", this.balance);
        } catch (e) {

        }

        this.loadTrans();
        //alert(responseJson.cipher);
        let toast = this.toastCtrl.create({
          message: "Thank you, Payment Suceessfully!",
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
      else {
        let toast = this.toastCtrl.create({
          message: responseJson.response,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }

      loading.dismiss();
    });
  }

  passcodeAlert(merchantId, transCode, number) {

    let alert = this.alertCtrl.create({
      title: 'Passcode',
      subTitle: 'Pay ' + this.merchantName + ' EUR ' + this.amount,
      enableBackdropDismiss: false,
      inputs: [{
        name: 'passcode',
        placeholder: '6 digits',
        type: 'tel'
      }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Pay',
          handler: inputData => {
            if (inputData.passcode.toString() == this.passcode) {
              alert.dismiss();
              this.paymentConfirmation(inputData.passcode.toString(), merchantId, transCode, number);
            }
            else {
              let toast = this.toastCtrl.create({
                message: 'Passcode incorrect, try again!',
                duration: 3000,
                position: 'top'
              });
              toast.present();
            }
          }
        }]
    });
    alert.present({
      keyboardClose: false
    });
  }

  selectCardAlert(merchantId, transCode) {
    let selectCardAlert = this.alertCtrl.create({
      title: 'Select Card',
      // buttons: [
      //   {
      //     text: 'Cancel',
      //     role: 'cancel',
      //   },
      //   {
      //     text: 'Pay',
      //     handler: selectedCard => {
      //       selectCardAlert.dismiss();
      //       this.passcodeAlert(merchantId, transCode, selectedCard);
      //     }
      //   }]
    });

    if (this.cards.length == 0) {
      selectCardAlert.setMessage("Not Enough credit and No card registered! Please add a Card First!");
      selectCardAlert.addButton({
        text: 'OK',
        role: 'cancel'
      });
    }
    else {
      selectCardAlert.setMessage("Not Enough credit, please select a card to pay");
      (this.cards).forEach((aCard, index) => {
        if (index == 0) {
          selectCardAlert.addInput({
            type: 'radio',
            label: aCard.hidedNum,
            value: aCard.CardNum.toString(),
            checked: true
          });
        }
        else {
          selectCardAlert.addInput({
            type: 'radio',
            label: aCard.hidedNum,
            value: aCard.CardNum.toString()
          });
        }
      })
      selectCardAlert.addButton({
        text: 'Cancel',
        role: 'cancel',
      });
      selectCardAlert.addButton({
        text: 'Pay',
        handler: selectedCard => {
          selectCardAlert.dismiss();
          //this.checkIsAvailable(merchantId, transCode, selectedCard)
          //this.passcodeAlert(merchantId, transCode, selectedCard);
          if (this.fpAvailable) {
            this.showFingerprint(merchantId, transCode, selectedCard);
          }
          else
            this.passcodeAlert(merchantId, transCode, selectedCard);
        }
      });

    }

    selectCardAlert.present();
  }

  //_paymentConfirmation END

  openPage(index) {
    let navPar = {
      email: this.email,
      pbk: this.pbk,
      sessKey: this.sessKey,
      sessIv: this.sessIv
    };
    this.navCtrl.push(this.pages[index], navPar);
  }
  //openPage END

  async logHistory() {
    let myIp = await this.services.getIpAddress().then(data => { return data; });

    let logInfoCipher = JSON.stringify({
      "uuid": this.crypto.RSAEncypto(JSON.parse(this.helper.getDeviceInfo()).uuid + "", this.pbk),
      "data": this.crypto.AESEncypto(JSON.stringify({
        "email": this.email,
        "datetime": new Date().getTime(),
        "ip": myIp
      }), this.sessKey, this.sessIv)
    });

    await this.services.doPOST("mpay/account/recordHistory", logInfoCipher);
    //log history
  }
  //logHistory END

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      for (let i = 0; i < 30; i++) {
        this.transactions.push(this.transactions.length);
      }

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }


  loadCards() {
    let uuid = (JSON.parse(this.helper.getDeviceInfo()).uuid) + "";
    let cipher = JSON.stringify({
      "uuid": this.crypto.RSAEncypto(uuid, this.pbk),
      "email": this.crypto.RSAEncypto(this.email, this.pbk)
    });
    this.loadCardsRetturns(cipher)
  }

  async loadCardsRetturns(cipher) {

    let response = await this.services.doPOST("mpay/registercard/loadCards", cipher).then(data => { return data; });

    let responseJson = JSON.parse(response.toString());
    let hiden = "**** **** **** ";
    if (responseJson.response == 1) {
      this.cards = JSON.parse(this.crypto.AESDecypto(responseJson.card, this.sessKey, this.sessIv));
      if (this.cards.length > 0) {
        (this.cards).forEach((aCard) => {
          aCard.hidedNum = hiden + (aCard.CardNum.toString()).substring(12, 16);
        });
      }
    }
  }

  loadTrans() {
    let uuid = (JSON.parse(this.helper.getDeviceInfo()).uuid) + "";
    let cipher = JSON.stringify({
      "uuid": this.crypto.RSAEncypto(uuid, this.pbk),
      "email": this.crypto.RSAEncypto(this.email, this.pbk),
      "start": 0,
      "end": 9
    });
    this.loadTransReturns(cipher)

  }
  async loadTransReturns(cipher) {
    // let loading = this.loading.create({
    //   content: 'Processing...'
    // });
    // loading.present();
    let response = await this.services.doPOST("mpay/transaction/history", cipher).then(data => { return data; });

    let responseJson = JSON.parse(response.toString());
    if (responseJson.response == 1) {
      this.hasTransHistory = true;

      let historyStr = this.crypto.AESDecypto(responseJson.cipher, this.sessKey, this.sessIv);
      let historyArray = JSON.parse(historyStr);

      this.transactions = historyArray;
    }
    else {
      this.hasTransHistory = false;
    }

    //loading.dismiss();
  }

  transTap(id, type) {
    alert(id + " " + type);
  }

  topup_withdraw(type: string) {
    let modal = this.modalCtrl.create(TopupWithdrawModalPage,
      {
        "type": type,
        "cards": this.cards,
        "balance": this.balance,
        "email": this.email,
        "pbk": this.pbk,
        "sessKey": this.sessKey,
        "sessIv": this.sessIv
      });
    modal.present();
  }

  updateHistory() {
    this.event.subscribe('updateHistory', () => {
      this.loadTrans();
    });
  }

  viewHistory(aTrans) {
    let modal = this.modalCtrl.create(HistoryModalPage, { "aTrans": aTrans });
    modal.present();
  }

  realodCardListener() {
    this.event.subscribe('reloadCards', () => {
      this.loadCards();
    });
  }

  async writeSettingFile() {
    let settings = JSON.stringify({
      'email': this.email,
      'password': this.password,
      'fpLogin': this.fpLogin,
      'fpPay': this.fpPay
    });

    await this.helper.writeFile("settings.json", settings);
  }


  sendMoney() {
    let modal = this.modalCtrl.create(SendMoneyPage,
      {
        "cards": this.cards,
        "balance": this.balance,
        "email": this.email,
        "pbk": this.pbk,
        "sessKey": this.sessKey,
        "sessIv": this.sessIv,
        "passcode": this.passcode
      });
    modal.present();
  }

  updatingBalance() {
    let emailStr = JSON.stringify({
      'email': this.email
    });

    let emailCipher = this.crypto.AESEncypto(emailStr, this.sessKey, this.sessIv);

    let dataPack = JSON.stringify({
      "uuid": this.crypto.RSAEncypto(JSON.parse(this.helper.getDeviceInfo()).uuid + "", this.pbk),
      "data": emailCipher
    });

    this.services.doPOST("mpay/account/updatingBalance", dataPack).then((response) => {

      let responseJson = JSON.parse(response.toString());
      if (responseJson.response == 1) {
        this.balance = this.crypto.AESDecypto(responseJson.balance, this.sessKey, this.sessIv);
        this.event.publish("updateBalance", this.balance);
      }
    });
  }

  async checkIsAvailable(merchantId, transCode, number) {
    try {
      await this.platform.ready();
      const isAvailable = await this.fingerprint.isAvailable();
      if (isAvailable == "Available") {
        const isFileExist = await this.helper.checkFile("settings.json");
        if (isFileExist) {
          let settings = JSON.parse(await this.helper.readFile("settings.json"));
          let fpPay = settings.fpPay;
          //alert("settings: "+ await this.helper.readFile("settings.json"));
          if (fpPay == 'true' || fpPay == true) {
            this.showFingerprint(merchantId, transCode, number);
          }
          else {
            this.passcodeAlert(merchantId, transCode, number);
          }
        }
      }
      else {
        this.passcodeAlert(merchantId, transCode, number);
      }
    } catch (e) {
      alert(e);
    }

  }

  async showFingerprint(merchantId, transCode, number) {
    let fpResult = await this.fingerprint.show({
      clientId: 'Pay ' + this.merchantName + ' EUR ' + this.amount,
      localizedFallbackTitle: 'Use Pin', //Only for iOS
      localizedReason: 'Pay ' + this.merchantName + ' EUR ' + this.amount,
    });

    if (fpResult == "Success") {
      this.paymentConfirmation(this.passcode.toString(), merchantId, transCode, number);
    }

  }

  async checkFPAvailable() {
    await this.platform.ready();
    const isAvailable = await this.fingerprint.isAvailable();
    if (isAvailable == "Available") {
      const isFileExist = await this.helper.checkFile("settings.json");
      if (isFileExist) {
        let settings = JSON.parse(await this.helper.readFile("settings.json"));
        let fpPay = settings.fpPay;
        //alert("settings: "+ await this.helper.readFile("settings.json"));
        if (fpPay == 'true' || fpPay == true) {
          this.fpAvailable = true;
        }
        else {
          this.fpAvailable = false;
        }
      }
    }
    else this.fpAvailable = false;
  }



}
