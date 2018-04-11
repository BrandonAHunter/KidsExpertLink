
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Parse } from 'parse';
import { AlertController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage 
{
    private TypeOfUser: string = '';

    private password: string = '';
    private username: string = '';
    private verify: string = '';
    
    private firstName: string = '';
    private lastName: string = '';

    private phone: string = '';
    private email: string = '';
    
    private userNameUsed: boolean = false;
    private emailUsed: boolean = false;

    constructor(public navCtrl: NavController, private loadCtrl: LoadingController,
                private alertCtrl: AlertController)
    {

    }

    ionViewDidLoad() 
    {
        console.log('Initiate Signup');
    }

    public doRegister() 
    {
        this.userNameUsed = false;
        this.emailUsed = false;

        let self = this;
        const UserParse = Parse.Object.extend('User');

        let userNameCheckQuery = new Parse.Query(UserParse);
        userNameCheckQuery.equalTo("username", self.username);
        userNameCheckQuery.first({
            success: function (entry) 
            {
                if (entry)
                {
                    self.userNameUsed = true;
                }
            },
            error: function (error) 
            {
                
            }
        }).then(function(obj) 
        {
            let emailCheckQuery = new Parse.Query(UserParse);
            emailCheckQuery.equalTo("email", self.email);
            emailCheckQuery.first({
                success: function (entry) 
                {
                    if (entry)
                    {
                        self.emailUsed = true;
                    }
                },
                error: function (error) 
                {
                    
                }
            }).then(function(obj) 
            {
                if (self.userNameUsed)
                {
                    self.presentAlert("username " + self.username + " is already used");
                }
                else if (self.emailUsed)
                {
                    self.presentAlert("email " + self.email + " is already used");
                }
                else if (self.password != self.verify)
                {
                    self.presentAlert("Passwords do not match");
                }
                else if (self.TypeOfUser != "Student" && self.TypeOfUser != "Professional")
                {
                    self.presentAlert("User type must be specificed");
                }
                else
                {
                    var user = new Parse.User();
                    user.set("username", self.username);
                    user.set("password", self.password);
                    user.set("email", self.email);
                    user.set("contactEmail", self.email);
                    user.set("firstName", self.firstName);
                    user.set("lastName", self.lastName);
                    user.set("phone", self.phone);
                    user.set("TypeOfUser", self.TypeOfUser);

                    user.signUp(null, {
                        success: function(user) 
                        {
                            console.log("signup success");
                            self.navCtrl.pop();
                        },
                        error: function(user, error) 
                        {
                            console.log("Error: " + error.code + " " + error.message);
                            self.presentAlert(error.message);
                        }
                    });

                    console.log("sign up complete");
                }
            });
        });
    }

    private presentAlert(text: string) 
    {
        console.log(text);
        let alert = this.alertCtrl.create(
        {
            title: 'Alert',
            subTitle: text,
            buttons: ['Ok']
        });
        alert.present();
    }
}
