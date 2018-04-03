import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Events, LoadingController} from 'ionic-angular';
import { AddcardPage } from '../addcard/addcard';
import { CryptographyProvider } from '../../providers/cryptography/cryptography';
import { ServicesProvider } from '../../providers/services/services';
import { HelperProvider } from '../../providers/helper/helper';
//import { CryptoProvider } from '../../providers/crypto/crypto';


@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html',
})
export class CardsPage {

  cards: any = new Array();
  email: any;
  hasCard:any;
  
  pbk:any;
  sessKey:any;
  sessIv:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public events: Events,
    public loadingCtrl: LoadingController,
    public helper: HelperProvider,
    public cryptography: CryptographyProvider,
    public services: ServicesProvider, 
    //private crypt: CryptoProvider
  ) {

    this.email = navParams.get("email");

    this.sessKey = navParams.get("sessKey");

    alert("sessKey = "+this.sessKey);
    setTimeout(() => {
      //this.loadCards();
    }, 150);
    
    alert(this.email);

    
    //this.realodCardListener();
  }

  ionViewDidLoad() {
    
    //console.log('this is output when card view loaded_2');
  }

  presentActionSheet(CardNum) {

    //console.log("card click = "+ CardNum);

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Option',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            console.log('Delete clicked');
          }
        }, {
          text: 'View Balance',
          handler: () => {
            console.log('View Balance clicked');
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  loadCards(){
    
  }

  addCard() {
    this.navCtrl.push(AddcardPage);
  }
}
