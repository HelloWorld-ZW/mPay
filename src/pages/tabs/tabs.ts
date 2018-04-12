import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { FriendsPage } from '../friends/friends';
import { HistoryPage } from '../history/history';
//import { SettingsPage } from '../settings/settings';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { SettingsPage } from '../settings/settings';
import { CardPage } from '../card/card';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = FriendsPage;
  tab3Root = HistoryPage;

  pages = [CardPage, SettingsPage];

  username: string;
  email: string;
  balance: any;

  pbk: any;
  sessKey: any;
  sessIv: any;

  //tab4Root = SettingsPage;
  constructor(public navParams: NavParams,
    public navCtl: NavController,
    public event: Events) {
    //console.log(navParams);
    this.username = navParams.get("username");
    this.balance = navParams.get("balance");

    this.username = navParams.get("username");
    this.email = navParams.get("email");
    this.balance = navParams.get("balance");

    this.pbk = navParams.get("pbk");
    this.sessKey = navParams.get("sessKey");
    this.sessIv = navParams.get("sessIv");


    this.event.subscribe("updateBalance", (balance) => {
      this.balance = balance;
    });
  }

  _logout() {
    this.navCtl.setRoot(LoginPage);
  }

  gotoPage(index) {

    let navPar = {
      email: this.email,
      pbk: this.pbk,
      sessKey: this.sessKey,
      sessIv: this.sessIv
    };

    this.navCtl.push(this.pages[index], navPar);
  }
}
