import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController, Events } from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
import { CryptoProvider } from '../../providers/crypto/crypto';
import { HelperProvider } from '../../providers/helper/helper';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Platform } from 'ionic-angular';


@Component({
  selector: 'page-send-money',
  templateUrl: 'send-money.html',
})
export class SendMoneyPage {

  email: string;
  passcode:any;
  pbk: any;
  sessKey: any;
  sessIv: any;

  balance: any;

  cards: any;

  receiver: any = null;
  selectedCard: any = null;
  friends: any;
  payType: any = 'default';
  inputMoney: any = '1.00';

  friendsList: any = new Array();

  start: any = 0;
  end: any = 9;

  uuid_cipher: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public services: ServicesProvider,
    public crypto: CryptoProvider,
    public helper: HelperProvider,
    public alertCtrl: AlertController,
    public toastCtrl:ToastController,
    private fingerprint: FingerprintAIO,
    private platform: Platform,
    public event:Events
  ) {

    this.email = navParams.get("email");

    this.pbk = navParams.get("pbk");
    this.sessKey = navParams.get("sessKey");
    this.sessIv = navParams.get("sessIv");
    this.cards = navParams.get("cards");
    this.balance = navParams.get("balance");
    this.passcode = navParams.get("passcode");

    this.receiver = navParams.get("friendSelected");

    this.uuid_cipher = this.crypto.RSAEncypto(this.helper.getDeviceUUID(), this.pbk);

    this.loadFriends(this.start, this.end);

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

  loadFriends(start, end) {
    let data = JSON.stringify({
      'uuid': this.uuid_cipher,
      'email': this.crypto.AESEncypto(this.email, this.sessKey, this.sessIv),
      'start': start,
      'end': end
    });

    let list = new Array
    this.services.doPOST("mpay/account/loadFriend", data).then((response) => {

      let responseJson = JSON.parse(response.toString());

      if (responseJson.response == 1) {
        let responseList = JSON.parse(this.crypto.AESDecypto(responseJson.list, this.sessKey, this.sessIv));

        this.friendsList = this.friendsList.concat(responseList);
      }

      if (responseJson.more == 1) {
        this.loadFriends(this.start + 10, this.end + 10);
      }
    });

  }

  onSubmit() {

    let alert = this.alertCtrl.create({
    });


    if(this.helper.countDecimals(this.inputMoney)>2)
    {
      this.inputMoney = parseFloat(this.inputMoney)*10;
    }

    if (this.receiver == null) {
      alert.setTitle("Error");
      alert.setMessage("Please Select a friend! ");
      alert.addButton("OK");
      alert.present();
      return;
    }

    if (this.payType == 'card') {
      if (this.selectedCard == null) {
        alert.setTitle("Error");
        alert.setMessage("Please Select a card! ");
        alert.addButton("OK");
        alert.present();
        return;
      }
    }

    if (this.payType == 'default') {
      if (parseFloat(this.inputMoney) > parseFloat(this.balance))
        this.inputMoney = this.balance;

      if (parseFloat(this.inputMoney) < 1)
        this.inputMoney = '1.00';
    }


    alert.setTitle("Confirmation");
    alert.setMessage("Do want to send EUR " + this.inputMoney + " to " + this.receiver) + " ?";
    alert.addButton("Cancel");
    alert.addButton({
      text: 'YES',
      handler:()=>{
        this.confirmTransfer();
      }
    });
    alert.present();

  }

  onChange() {
    setTimeout(() => {
      if (parseFloat(this.inputMoney) > parseFloat(this.balance))
        this.inputMoney = this.balance;
    }, 300);
  }

  confirmTransfer(){
    let transInfo = JSON.stringify({
      'sender': this.email,
      'receiver': this.receiver,
      'payType': this.payType,
      'amount': this.inputMoney,
      'cardNum': this.selectedCard
    });

    let cipher = JSON.stringify({
      'uuid': this.uuid_cipher,
      'data': this.crypto.AESEncypto(transInfo, this.sessKey, this.sessIv)
    });

  
    this.checkIsAvailable(cipher);
    
  }

  passcodeAlert(cipher) {
    let passcodeAlert = this.alertCtrl.create({
      title: 'Passcode',
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
              passcodeAlert.dismiss();

              this.services.doPOST("mpay/transaction/sendMoney", cipher).then((response)=>{
                let responseJson = JSON.parse(response.toString());
                if(responseJson.response == 1){
                  let toast = this.toastCtrl.create({
                    message: 'Transfer Successfully!',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                  this.dismiss();
                }
                else{
                  let toast = this.toastCtrl.create({
                    message: responseJson.response,
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                }
              });

            }
            else {
              let toast = this.toastCtrl.create({
                message: 'Passcode incorrect, try again!',
                duration: 3000,
                position: 'top'
              });
              toast.present();

              this.passcodeAlert(cipher); //////
            }
          }
        }]
    });
    passcodeAlert.present({
      keyboardClose: false
    });
  }

  async checkIsAvailable(cipher) {
    try {
      await this.platform.ready();
      const isAvailable = await this.fingerprint.isAvailable();
      if (isAvailable == "Available") {
        const isFileExist = await this.helper.checkFile("settings.json");
        if (isFileExist) {
          let settings = JSON.parse(await this.helper.readFile("settings.json"));
          let fpPay = settings.fpPay;
          //alert("settings: "+ await this.helper.readFile("settings.json"));
          if (fpPay == 'true' || fpPay==true) {
            this.showFingerprint(cipher);
          }
          else{
            this.passcodeAlert(cipher);
          }
        }
      }
      else{
        this.passcodeAlert(cipher);
      }
    } catch (e) {
      alert(e);
    }

  }

  async showFingerprint(cipher) {
    let fpResult = await this.fingerprint.show({
      clientId: 'Send to: ' + this.receiver + " EUR "+this.inputMoney,
      localizedFallbackTitle: 'Use Pin', //Only for iOS
      localizedReason: 'Send to: ' + this.receiver + " EUR "+this.inputMoney//Only for iOS
    });

    if(fpResult == "Success"){
      this.services.doPOST("mpay/transaction/sendMoney", cipher).then((response)=>{
        let responseJson = JSON.parse(response.toString());
        if(responseJson.response == 1){
          let toast = this.toastCtrl.create({
            message: 'Transfer Successfully!',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.dismiss();
        }
        else{
          let toast = this.toastCtrl.create({
            message: responseJson.response,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      });
    }
  }

}
