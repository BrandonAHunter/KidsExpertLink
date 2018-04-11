import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public data: Data)
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
        }, 
        function(error){
            //Handle the error
        });
    }
}
