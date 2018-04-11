import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Parse } from 'parse';
import { AlertController } from 'ionic-angular';

// Providers
import { Data } from '../../providers/data';
// https://ionicframework.com/docs/api/navigation/NavController/#setRoot

// Pages
import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage 
{
    registerPage = SignupPage;
    password: string = '';
    username: string = '';

    constructor(public navCtrl: NavController, public data: Data, 
                private loadCtrl: LoadingController, private alertCtrl: AlertController)
    {

    }
    
    ionViewDidLoad() 
    {
        console.log('Initiated Signin');
    }

    public doSignin() 
    {
        var self = this;
        Parse.User.logIn(this.username, this.password, 
        {
            success: function(user) 
            {
                console.log("logged in " + user.get("username"));
                self.navCtrl.setRoot(TabsPage);
                self.data.load();
            },
            error: function(user, error) 
            {
                console.log("Error: " + error.code + " " + error.message);
                self.presentAlert(error.message);
            }
        });
    }

    private presentAlert(text: string) 
    {
        console.log(text);
        let alert = this.alertCtrl.create(
        {
            title: text,
            buttons: ['Ok']
        });
        alert.present();
    }
}
