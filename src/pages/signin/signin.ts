import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Parse } from 'parse';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import * as CryptoJS from 'crypto-js';

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
    
    private loginOnStart: boolean = false;
    private isFacebookLogin: boolean = false;

    private TypeOfUser: string = "Student";

    private username: string = '';
    private password: string = '';
    
    private loader;

    private key = CryptoJS.enc.Utf8.parse('7061737323313233');
    private iv = CryptoJS.enc.Utf8.parse('7061737323313233');

    constructor(public navCtrl: NavController, public data: Data, public platform: Platform,
                private loadCtrl: LoadingController, private alertCtrl: AlertController,
                public storage: Storage, private facebook: Facebook)
    {
        
    }
    
    ionViewDidLoad() 
    {
        console.log('Initiated Signin');

        let self = this;

        this.storage.get("isFacebook").then((isFacebook) => 
        {
            if (isFacebook != undefined)
            {
                self.isFacebookLogin = isFacebook;
            }

        }).then(function() 
        {
            self.storage.get("username").then((user) => 
            {
                if (user != undefined && user != '')
                {
                    self.username = user;
                }

            }).then(function()
            {
                self.storage.get("autoLogin").then((autoLogin) => 
                {
                    if (autoLogin != undefined)
                    {
                        if (autoLogin)
                        {
                            console.log("auto login: " + autoLogin);
                            self.loginOnStart = autoLogin;
                            if (self.loginOnStart)
                            {
                                if (self.isFacebookLogin)
                                {
                                    self.facebookAutoLogin();
                                }
                                else
                                {
                                    self.normalAutoLogin();
                                }
                            }
                        }
                    }
                });
            });
        });
    }
    
    private normalAutoLogin()
    {
        let self = this;
        if (self.username != '')
        {
            self.storage.get("password").then((pass) => 
            {
                if (pass != undefined && pass != '')
                {
                    var decrypted = CryptoJS.AES.decrypt(pass, self.key, 
                    {
                        keySize: 128 / 8,
                        iv: self.iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    });

                    self.password = decrypted.toString(CryptoJS.enc.Utf8);

                    self.doSignin();
                }
            });
        }
    }

    private facebookAutoLogin()
    {
        if (this.platform.is('cordova'))
        {
            this.loader = this.loadCtrl.create(
            {
                content: 'Signing in...'
            });

            this.loader.present();

            let self = this;
            if (self.username != '')
            {
                var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(self.username), self.key,
                {
                    keySize: 128 / 8,
                    iv: self.iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }).toString();
                
                self.password = encrypted;
                Parse.User.logIn(self.username, self.password, 
                {
                    success: function(user) 
                    {
                        self.loader.dismissAll();
                        self.navCtrl.setRoot(TabsPage);
                        self.data.load();
                    },
                    error: function(user, error) 
                    {
                        console.log("Error: " + error.code + " " + error.message);

                        self.data.clearLoginData();

                        self.loader.dismissAll();
                        self.presentAlert(error.message);
                    }
                });
            }
        }
    }

    public doSignin() 
    {
        this.loader = this.loadCtrl.create(
        {
            content: 'Signing in...'
        });

        this.loader.present();

        let lowerUser = this.username.toLowerCase();
        
        var self = this;
        Parse.User.logIn(lowerUser, this.password, 
        {
            success: function(user) 
            {
                console.log("logged in " + user.get("username"));

                var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(self.password), self.key,
                {
                    keySize: 128 / 8,
                    iv: self.iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }).toString();

                self.storage.set("isFacebook", false);
                self.storage.set("password", encrypted);
                self.storage.set("username", self.username);
                self.storage.set("autoLogin", self.loginOnStart);
                
                self.loader.dismissAll();
                self.navCtrl.setRoot(TabsPage);
                self.data.load();
            },
            error: function(user, error) 
            {
                console.log("Error: " + error.code + " " + error.message);

                self.data.clearLoginData();

                self.loader.dismissAll();
                self.presentAlert(error.message);
            }
        });
    }

    private facebookLogin()
    {
        if (this.platform.is('cordova'))
        {
            let self = this;

            this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
                self.facebook.api('me?fields=id,name,email,first_name,last_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
                    
                    let usernameUsed = false;
                    self.username = profile['name'].toLowerCase();

                    const UserParse = Parse.Object.extend('User');
                    let userNameCheckQuery = new Parse.Query(UserParse);
                    userNameCheckQuery.equalTo("username", self.username);
                    userNameCheckQuery.first({
                        success: function (entry) 
                        {
                            if (entry)
                            {
                                usernameUsed = true;
                            }
                        },
                        error: function (error) { }
                    }).then(function()
                    {
                        if (usernameUsed)
                        {
                            self.loader = self.loadCtrl.create(
                            {
                                content: 'Signing in...'
                            });

                            self.loader.present();

                            var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(self.username), self.key,
                            {
                                keySize: 128 / 8,
                                iv: self.iv,
                                mode: CryptoJS.mode.CBC,
                                padding: CryptoJS.pad.Pkcs7
                            }).toString();

                            self.password = encrypted;

                            Parse.User.logIn(self.username, self.password, 
                            {
                                success: function(user) 
                                {
                                    self.storage.set("username", self.username);
                                    self.storage.set("autoLogin", self.loginOnStart);
                                    self.storage.set("isFacebook", true);

                                    self.loader.dismissAll();
                                    self.navCtrl.setRoot(TabsPage);
                                    self.data.load();
                                },
                                error: function(user, error) 
                                {
                                    console.log("Error: " + error.code + " " + error.message);

                                    self.data.clearLoginData();

                                    self.loader.dismissAll();
                                    self.presentAlert(error.message);
                                }
                            });
                        }
                        else
                        {
                            self.presentAskUserType(profile);
                        }
                    });
                });
            });
        }
        else
        {
            this.presentAlert("Facebook login is not available. Device does not support cordova.");
        }
    }
    
    private facebookSignUp(profile)
    {
        this.loader = this.loadCtrl.create(
        {
            content: 'Signing up...'
        });

        this.loader.present();

        let self = this;
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(self.username), self.key,
        {
            keySize: 128 / 8,
            iv: self.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();

        self.password = encrypted;

        let firstName = profile['first_name'];
        let lastName = profile['last_name'];

        let phone = '';
        let email = profile['email'].toLowerCase();

        let picture = profile['picture_large']['data']['url'];

        var user = new Parse.User();

        user.set("username", self.username);
        user.set("password", self.password);
        user.set("email", email);
        user.set("contactEmail", email);
        user.set("firstName", firstName);
        user.set("lastName", lastName);
        user.set("phone", phone);
        user.set("TypeOfUser", self.TypeOfUser);

        user.signUp(null, {
            success: function(user) 
            {
                console.log("signup success");

                Parse.User.logIn(self.username, self.password, 
                {
                    success: function(user) 
                    {
                        console.log("logged in " + user.get("username"));

                        self.storage.set("username", self.username);
                        self.storage.set("autoLogin", self.loginOnStart);
                        self.storage.set("isFacebook", true);

                        self.loader.dismissAll();
                        self.navCtrl.setRoot(TabsPage);
                        self.data.load();
                    },
                    error: function(user, error) 
                    {
                        console.log("Error: " + error.code + " " + error.message);

                        self.data.clearLoginData();

                        self.loader.dismissAll();
                        self.presentAlert(error.message);
                    }
                });
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

    private presentAskUserType(profile) 
    {
        let self = this;
        let alert = this.alertCtrl.create({
        title: 'Are you a student or professional?',
        buttons: [
            {
                text: 'Student',
                handler: () => {
                    self.TypeOfUser = "Student";
                    self.facebookSignUp(profile);
                }
            },
            {
                text: 'Professional',
                handler: () => {
                    self.TypeOfUser = "Professional";
                    self.facebookSignUp(profile);
                }
            }
        ]
        });

        alert.present();
    }
}
