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

    private request;

    button;
    pendingContact;
    requestContact;
    contactSection;
    grantContact;

    constructor(public navCtrl: NavController, public navParams: NavParams, 
                public view: ViewController, private alertCtrl: AlertController,
                public data: Data) 
    {

    }

    ionViewDidLoad() 
    {
        this.button = document.getElementById("linkButton");
        this.pendingContact = document.getElementById("pendingContact");
        this.requestContact = document.getElementById("requestContact");
        this.contactSection = document.getElementById("contactSection");
        this.grantContact = document.getElementById("grantContact");

        this.button.innerHTML = "Link";
        this.button.style.color = "#4286f4";

        this.item = this.navParams.get('item');

        var currentUser = Parse.User.current();
        this.TypeUsing = currentUser.get('TypeOfUser');
        console.log(this.TypeUsing);

        this.button.style.display = "none";
        this.requestContact.style.display = "none";
        this.pendingContact.style.display = "none";
        this.contactSection.style.display = "none";
        this.grantContact.style.display = "none";

        if (this.TypeUsing == "Student")
        {
            this.grantContact.style.display = "block";
        }

        if (this.TypeUsing == "Professional")
        {
            this.button.style.display = "block";

            this.request = this.data.getRequest(this.item.IdeaId, currentUser.id);
            console.log(this.request);

            if(this.request == "Empty"){
                this.requestContact.style.display = "block";
            }
            else if(this.request == "Pending"){
                this.pendingContact.style.display = "block";
            }
            else if(this.request == "Granted"){
                this.contactSection.style.display = "block";
            }
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
                this.button.style.color = "#f00";
                this.button.innerHTML = "Unlink";
                break;
            }
        }
    }

    Link()
    {
        if (this.button.innerHTML == "Link")
        {
            this.button.style.color = "#f00";
            this.button.innerHTML = "Unlink";
            this.requestContact.style.display = "block";
        }
        else
        {
            this.button.style.color = "#4286f4";
            this.button.innerHTML = "Link";
            this.requestContact.style.display = "none";
            this.pendingContact.style.display = "none";
            this.contactSection.style.display = "none";
        }
        
        this.data.toggleLink(this.item.IdeaId, Parse.User.current().id, this.item.Creator);
    }
    
    RequestContact()
    {
        this.data.SendRequest(this.item.IdeaId, Parse.User.current().id);
        this.requestContact.style.display = "none";

        this.pendingContact.style.display = "block";
    }

    GetLinks()
    {
        if(this.TypeUsing == "Student")
        {
            return this.data.GetLinks(this.item.IdeaId, Parse.User.current().id);
        }
    }

    GrantContact(Link)
    {
        this.data.GrantRequest(Link);
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
