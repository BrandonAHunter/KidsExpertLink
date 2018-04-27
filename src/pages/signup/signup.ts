
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Parse } from 'parse';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage 
{
    private TypeOfUser: string = "Student";

    private password: string = '';
    private username: string = '';
    private verify: string = '';
    
    private firstName: string = '';
    private lastName: string = '';

    private phone: string = '';
    private email: string = '';
    
    private userNameUsed: boolean = false;
    private emailUsed: boolean = false;

    private loader;

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

        this.loader = this.loadCtrl.create(
        {
            content: 'Signing up...'
        });

        this.loader.present();

        let self = this;
        let lowerUser = self.username.toLowerCase();
        let lowerEmail = self.email.toLowerCase();
        const UserParse = Parse.Object.extend('User');

        let userNameCheckQuery = new Parse.Query(UserParse);
        userNameCheckQuery.equalTo("username", lowerUser);
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
            emailCheckQuery.equalTo("email", lowerEmail);
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
                    self.loader.dismissAll();
                    self.presentAlert("username " + self.username + " is already used");
                }
                else if (self.emailUsed)
                {
                    self.loader.dismissAll();
                    self.presentAlert("email " + self.email + " is already used");
                }
                else if (self.password != self.verify)
                {
                    self.loader.dismissAll();
                    self.presentAlert("Passwords do not match");
                }
                else if (self.TypeOfUser != "Student" && self.TypeOfUser != "Professional")
                {
                    self.loader.dismissAll();
                    self.presentAlert("User type must be specificed");
                }
                else if (self.areInputsValid())
                {
                    var user = new Parse.User();
                    user.set("username", lowerUser);
                    user.set("password", self.password);
                    user.set("email", lowerEmail);
                    user.set("contactEmail", lowerEmail);
                    user.set("firstName", self.firstName);
                    user.set("lastName", self.lastName);
                    user.set("phone", self.phone);
                    user.set("TypeOfUser", self.TypeOfUser);

                    user.signUp(null, {
                        success: function(user) 
                        {
                            self.loader.dismissAll();
                            console.log("signup success");
                            self.navCtrl.pop();
                        },
                        error: function(user, error) 
                        {
                            self.loader.dismissAll();
                            console.log("Error: " + error.code + " " + error.message);
                            self.presentAlert(error.message);
                        }
                    });

                    console.log("sign up complete");
                }
            });
        });
    }
    
    private areInputsValid(): boolean
    {
        if (!this.checkAlphanumeric(this.username))
        {
            this.loader.dismissAll();
            this.presentAlert("Username must only contain letters and numbers");
            return false;
        }
        else if (this.password.includes(' '))
        {
            this.loader.dismissAll();
            this.presentAlert("Password may not contain spaces");
            return false;
        }
        else if (!this.checkAlphabetic(this.firstName))
        {
            this.loader.dismissAll();
            this.presentAlert("First name must only contain letters");
            return false;
        }
        else if (!this.checkAlphabetic(this.lastName))
        {
            this.loader.dismissAll();
            this.presentAlert("Last name must only contain letters");
            return false;
        }
        else if (!this.checkNumeric(this.phone))
        {
            this.loader.dismissAll();
            this.presentAlert("Phone number must only contain numbers");
            return false;
        }

        return true;
    }

    private checkAlphanumeric(text: string)
    {
        return !/[^a-zA-Z0-9]/.test(text);
    }

    private checkAlphabetic(text: string)
    {
        return !/[^a-zA-Z]/.test(text);
    }

    private checkNumeric(text: string)
    {
        return !/[^0-9]/.test(text);
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
