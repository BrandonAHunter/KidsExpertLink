import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Data } from '../../providers/data';
import { Parse } from 'parse';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage 
{
    private typeUsing: string = '';

    private firstName: string = '';
    private lastName: string = '';
    private email: string = '';
    private phone: string = '';

    private initialFirstName: string = '';
    private initialLastName: string = '';
    private initialEmail: string = '';
    private initialPhone: string = '';

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public data: Data, private alertCtrl: AlertController)
    {

    }

    ionViewDidLoad() 
    {
        console.log('ionViewDidLoad ProfilePage');

        let self = this;
        let user = Parse.User.current();
        user.fetch().then(function(fetchedUser)
        {
            self.firstName = fetchedUser.get("firstName");
            self.lastName = fetchedUser.get("lastName");
            self.email = fetchedUser.get("email");
            self.phone = fetchedUser.get("phone");
            self.typeUsing = fetchedUser.get("TypeOfUser");
            
            self.initialFirstName = self.firstName;
            self.initialLastName = self.lastName;
            self.initialEmail = self.email;
            self.initialPhone = self.phone;
        }, 
        function(error){
            //Handle the error
        });
    }

    updateProfile()
    {
        if (this.initialEmail != this.email)
        {
            let emailUsed = false;
            let self = this;
            const UserParse = Parse.Object.extend('User');
            let emailCheckQuery = new Parse.Query(UserParse);
            emailCheckQuery.equalTo("email", self.email);
            emailCheckQuery.first({
                success: function (entry) 
                {
                    if (entry)
                    {
                        emailUsed = true;
                    }
                },
                error: function (error) 
                {
                    
                }
            }).then(function()
            {
                if (emailUsed)
                {
                    self.presentAlert("email " + self.email + " is already used");
                }
                else
                {
                    self.performUpdate();
                }
            });
        }
        else
        {
            this.performUpdate();
        }
    }

    performUpdate()
    {
        let self = this;
        var user = Parse.User.current();
        user.set("email", this.email);
        user.set("contactEmail", this.email);
        user.set("firstName", this.firstName);
        user.set("lastName", this.lastName);
        user.set("phone", this.phone);
        user.save(null, {
            success: function(user) 
            {
                self.initialFirstName = self.firstName;
                self.initialLastName = self.lastName;
                self.initialEmail = self.email;
                self.initialPhone = self.phone;
                console.log("profile update success");
                self.data.updateUser(self.firstName, self.lastName, self.email, self.phone);
                self.presentAlert("Profile updated");
            },
            error: function(user, error) 
            {
                self.firstName = self.initialFirstName;
                self.lastName = self.initialLastName;
                self.email = self.initialEmail;
                self.phone = self.initialPhone;
                console.log("Error: " + error.code + " " + error.message);
                self.presentAlert(error.message);
            }
        });
    }

    onKeyPress($event) //Fitler our special characters
    {
        if (($event.keyCode >= 65 && $event.keyCode <= 90) || 
            ($event.keyCode >= 97 && $event.keyCode <= 122) || 
             $event.keyCode == 46) 
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    
    onKeyPressPhone($event) //Fitler our special characters
    {
        if ($event.keyCode !== 69 && $event.keyCode !== 101) 
        {
            return true;
        }
        else
        {
            return false;
        }
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
