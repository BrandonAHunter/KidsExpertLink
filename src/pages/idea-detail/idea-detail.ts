import { Component } from '@angular/core';
import { NavParams, IonicPage, NavController, ViewController } from 'ionic-angular';
import { Parse } from 'parse';
import { ViewIdeaPage } from '../view-idea/view-idea';
import { AlertController } from 'ionic-angular';
import { Data } from '../../providers/data';

/**
 * Generated class for the IdeaDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-idea-detail',
  templateUrl: 'idea-detail.html',
})
export class IdeaDetailPage 
{
    private TypeUsing;
    private Title;
    private Description;
    private Name;
    private Email;
    private Phone;

    private item;

    constructor(public navCtrl: NavController, public navParams: NavParams, 
                public view: ViewController, private alertCtrl: AlertController,
                public data: Data) 
    {

    }

    ionViewDidLoad() 
    {
        let button = document.getElementById("linkButton");
        button.innerHTML = "Link";
        button.style.color = "#4286f4";

        this.item = this.navParams.get('item');

        var currentUser = Parse.User.current();
        this.TypeUsing = currentUser.get('TypeOfUser');

        if (this.TypeUsing == "Student")
        {
            let button = document.getElementById("linkButton");
            button.style.display = "none";

            let contactSection = document.getElementById("contactSection");
            contactSection.style.display = "none";
        }

        this.Title = this.item.Title;
        this.Description = this.item.Description;

        let user = this.data.getUserById(this.item.Creator);

        this.Name = user.Name;
        this.Email = user.Email;
        this.Phone = user.Phone;

        let linkedItems = this.data.LinkedItemsList;
        for (var i = 0; i < linkedItems.length; i++)
        {
            if (linkedItems[i].IdeaId == this.item.IdeaId)
            {
                button.style.color = "#f00";
                button.innerHTML = "Unlink";
                break;
            }
        }
    }

    Link()
    {
        let button = document.getElementById("linkButton");

        if (button.innerHTML == "Link")
        {
            button.style.color = "#f00";
            button.innerHTML = "Unlink";
        }
        else
        {
            button.style.color = "#4286f4";
            button.innerHTML = "Link";
        }
        
        this.data.toggleLink(this.item.IdeaId, Parse.User.current().id, this.item.Creator);
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
