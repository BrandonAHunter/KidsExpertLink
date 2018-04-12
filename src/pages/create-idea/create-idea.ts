import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Parse } from 'parse';
import { ViewIdeaPage } from '../view-idea/view-idea';

// Providers
import { Data } from '../../providers/data';
/**
 * Generated class for the CreateIdeaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-idea',
  templateUrl: 'create-idea.html',
})
export class CreateIdeaPage 
{
    private PageTitle: string = '';

    private Title: string = '';
    private Description: string = '';
    private ideaId: string;
    private creatorId: string;

    private Ideas;
    private isEditing = false;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private alertCtrl: AlertController, public data: Data,
                private platform: Platform) 
    {

    }

    ionViewDidLoad() 
    {
        console.log('ionViewDidLoad CreateIdeaPage');

        let idea = this.navParams.get('item');
        if (idea != undefined)
        {
            this.PageTitle = "Edit Idea";
            this.isEditing = true;
            this.ideaId = idea.IdeaId;
            this.creatorId = idea.Creator;
            this.Title = idea.Title;
            this.Description = idea.Description;
        }
        else
        {
            this.PageTitle = "Create Idea";
        }
        this.resize();
    }
    
    saveIdea()
    {
        if (this.isEditing)
        {
            this.data.editIdea(this.ideaId, this.creatorId, this.Title, this.Description);
            this.navCtrl.pop();
        }
        else
        {
            this.data.addIdea(Parse.User.current().id, this.Title, this.Description);
            this.Title = '';
            this.Description = '';
            this.presentAlert("Idea Created!");
        }
    }

    @ViewChild('descriptionInput') myInput: ElementRef;
    resize() 
    {
        var element = this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
        var scrollHeight = element.scrollHeight;
        element.style.height = scrollHeight + 'px';
        this.myInput['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';
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
