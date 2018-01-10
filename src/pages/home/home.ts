import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  username:string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    //console.log(navParams.data);
    this.username = navParams.get("username");
  }

}
