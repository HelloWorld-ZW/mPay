import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { LoadingController, AlertController } from 'ionic-angular';
import { CommunicationProvider } from '../../providers/communication/communication';
import { CardPage } from '../card/card';
import { ServicesProvider } from '../../providers/services/services';
import { CryptoProvider } from '../../providers/crypto/crypto';
import { HelperProvider } from '../../providers/helper/helper';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  username:string;
  email:string;
  balance:any;
  ipAddress:string;

  pbk:any;
  sessKey:any;
  sessIv:any;

  transactions: any=new Array();
  pages:any = [CardPage];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    public loading: LoadingController,
    public communication: CommunicationProvider,
    private alertCtrl: AlertController,
    public services: ServicesProvider,
    public crypto: CryptoProvider,
    public helper: HelperProvider) {
    
      //console.log(navParams.data);
    this.username = navParams.get("username");
    this.email = navParams.get("email");
    this.balance = navParams.get("balance");
    
    this.pbk = navParams.get("pbk");
    this.sessKey = navParams.get("sessKey");
    this.sessIv = navParams.get("sessIv");
    //alert(navParams.get("pbk"));
    
    this.logHistory();
    //this.helper.setStorageData("loggedIn",this.email); //save logged in email locally

    
    for(var i=0; i<20; i++){
      let obj = {
        "name": "Zhen",
        "Date": "01/01/2018",
        "transType": "Pay"
      };
      this.transactions.push(obj);
    }
    
    //load transaction history

  }
  //constructor END

  _scan(){
    this.barcodeScanner.scan().then(data => {
      let loading = this.loading.create({
        content: 'Processing...'
      });
      loading.present();
      
      if(this.codeValidation(data.text)){
        this.services.doPOST("mpay/transaction/getQrInfo", this.packTransCode(data.text))
        .then((response)=>{
          alert(response);
          let responseJson = JSON.parse(response+"");
          alert("response: "+responseJson.response);
          if(responseJson.response == 1){
            let plainStr = this.crypto.AESDecypto(responseJson.cipher, this.sessKey, this.sessIv);
            let plainJson = JSON.parse(plainStr);

            let alert = this.alertCtrl.create({
              title: 'Confirm Payment',
              message: 'Merchant: '+plainJson.merchantName +"<br/>Amount: "+plainJson.amount,
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel'
                },
                {
                  text: 'Pay',
                  handler: () => {
                    alert.dismiss();

                    //TODO: 
                    //check balance
                    // if enough, pop up passcode alert
                    // else pop up select card alert
                    this.passcodeAlert(plainJson.merchantId, data.text);
                  }
                }
              ]
            });
            alert.present();
          
          }
          else{
            alert("response err: "+responseJson.response);
          }

        });
       }
       else{
        alert("No such code "+data.text);
       }
      loading.dismiss();
     }).catch(err => {
        alert("error: "+err);
     });
      
  }
  // _scan END

  codeValidation(transCode:string){
    let prifix = transCode.substr(0,4);
    if(prifix=='mpay')
      return true;
    else
      return false;
  }

  packTransCode(transCode:string){
    let dataPack = JSON.stringify({
      "uuid": this.crypto.RSAEncypto(JSON.parse(this.helper.getDeviceInfo()).uuid+"", this.pbk),
      "code": this.crypto.RSAEncypto(transCode, this.pbk)
    });
    return dataPack;
  }
  
  
  paymentConfirmation(passcode, merchant, transCode){
    let passcodeJson = JSON.stringify(passcode);
    let paymentInfo = JSON.stringify({
      "sender": this.email,
      "receiver": merchant,
      "transCode": transCode
    });
    alert(paymentInfo);
        
  }

  passcodeAlert(merchantId, transCode){
    let passcodeAlert= this.alertCtrl.create({
      title: 'Passcode',
      inputs:[{
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
            passcodeAlert.dismiss();
            this.paymentConfirmation(JSON.stringify(inputData), merchantId, transCode);
          }
        }]
      });
      passcodeAlert.present();
  }

  //TODO: 
  selectCardAlert(){
    let selectCardAlert= this.alertCtrl.create({
      title: 'Passcode',
      inputs:[{
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
            selectCardAlert.dismiss();
            //this.paymentConfirmation(JSON.stringify(inputData), merchantId, transCode);
          }
        }]
      });
      selectCardAlert.present();
  }
  //_paymentConfirmation END

  openPage(index){
    let navPar = {
      email:this.email,
      pbk:this.pbk,
      sessKey:this.sessKey,
      sessIv:this.sessIv
    };
    this.navCtrl.push(this.pages[index],navPar);
  }
  //openPage END

  async logHistory(){
    let myIp = await this.services.getIpAddress().then(data=>{return data;});

    let logInfoCipher = JSON.stringify({
      "uuid":this.crypto.RSAEncypto(JSON.parse(this.helper.getDeviceInfo()).uuid+"", this.pbk),
      "data":this.crypto.AESEncypto(JSON.stringify({
        "email":this.email,
        "datetime": new Date().getTime(),
        "ip":myIp
      }),this.sessKey, this.sessIv)
    });

    await this.services.doPOST("mpay/account/recordHistory",logInfoCipher);
    //log history
  }
  //logHistory END

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      for (let i = 0; i < 30; i++) {
        this.transactions.push( this.transactions.length );
      }

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

}
