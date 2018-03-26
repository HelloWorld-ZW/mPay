import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ZBar,ZBarOptions  } from '@ionic-native/zbar';
import { LoadingController, AlertController } from 'ionic-angular';
import { CommunicationProvider } from '../../providers/communication/communication';
import { CardsPage } from '../cards/cards';
import { ServicesProvider } from '../../providers/services/services';
import { CryptographyProvider } from '../../providers/cryptography/cryptography';
import { HelperProvider } from '../../providers/helper/helper';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  username:string;
  email:string;
  ipAddress:string;

  somethings: any = new Array(10);
  pages:any = [CardsPage];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private zbar: ZBar,
    public loading: LoadingController,
    public communication: CommunicationProvider,
    private alertCtrl: AlertController,
    public services: ServicesProvider,
    public crypto: CryptographyProvider,
    public helper: HelperProvider) {
    
      //console.log(navParams.data);
    this.username = navParams.get("username");
    this.email = navParams.get("email");

    
    this.logHistory();
    //post login history
    //load transaction histor

  }

  _scan(){
    let loader = this.loading.create({
      content: 'Processing...',
    });

    let options: ZBarOptions = {
      flash: 'off',
      text_title: 'scan',
      //text_instructions: '请将二维码置于红线中央',
      // camera: "front" || "back",
      drawSight: true
    };

    this.zbar.scan(options)
    .then(result => {
      loader.present().then(() => {
        
        alert(result);
          // TODO: send code to sever
          this.communication.getQrCodeDetail(result).then(
            (response)=>{
              //this._paymentConfirmation(response.toString());
              // 
              alert(response.toString());
              
            },
            (err)=>{
              console.log(err);
          });

          //alert("结果：" + result);
          loader.dismiss();
      });
    })
    .catch(error => {
      alert(error); // Error message
    });
  }
  _paymentConfirmation(){
    console.log("hello");
    // let transDataJSON = JSON.parse(transData);
    // let receiver = transDataJSON.get("receiver");
    // let amount = transDataJSON.get("amount");
    // let transCode = transDataJSON.get("transCode");

    let confirmAlert = this.alertCtrl.create({
      title: 'Confirm payment',
      message: 'Do you want to pay ',//'+amount+" to "+receiver+" ?",
      buttons:[{
        text:'Cancel',
        role: 'cancel',
        handler: () => {
          // cancel evernt;
        }
      },
      {
        text:'Pay',
        handler: () => {
          // payment evernt;
        }
      }]
    });
    confirmAlert.present();
  }

  openPage(index){
    this.navCtrl.push(this.pages[index]);
  }

  async logHistory(){
    let myIp = await this.services.getIpAddress().then(data=>{return data;});

    let logInfoCipher = JSON.stringify({
      "uuid":this.crypto.RSAEnc(JSON.parse(this.helper.getDeviceInfo()).uuid+""),
      "data":this.crypto.AESEnc(JSON.stringify({
        "email":this.email,
        "datetime": new Date(),
        "ip":myIp
      }))
    });

    //TODO: POST to server

    console.log(logInfoCipher);
  }

}
