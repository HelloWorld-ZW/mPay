import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import {FriendsPage } from '../friends/friends';
import { HistoryPage } from '../history/history';
//import { SettingsPage } from '../settings/settings';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = FriendsPage;
  tab3Root = HistoryPage;

  username:string;
  balance:any;
  //tab4Root = SettingsPage;
  constructor(public navParams: NavParams, 
    public navCtl:NavController,
    public event: Events) {
    //console.log(navParams);
    this.username = navParams.get("username");
    this.balance = navParams.get("balance");
    this.event.subscribe("updateBalance",(balance)=>{
      this.balance = balance;
    });
  }

  _logout(){
    this.navCtl.setRoot(LoginPage);
  }
}
