import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AddcardPage } from '../addcard/addcard';


@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html',
})
export class CardsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad CardsPage');
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Option',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            console.log('Delete clicked');
          }
        },{
          text: 'View Balance',
          handler: () => {
            console.log('View Balance clicked');
          }
        },{
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


  addCard(){
    this.navCtrl.push(AddcardPage);
  }
}
