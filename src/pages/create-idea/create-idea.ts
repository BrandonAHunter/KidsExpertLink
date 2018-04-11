import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
    Title;
    Description;
    Ideas;
    constructor(public navCtrl: NavController, public navParams: NavParams) 
    {

    }

    ionViewDidLoad() 
    {
        console.log('ionViewDidLoad CreateIdeaPage');
    }
    
    CreateDescription()
    {
        var self = this;

        var Idea = new this.Ideas();
        Idea.set('CreatedBy', Parse.User.current().id);
        Idea.set('Title', this.Title);
        Idea.set('Description', this.Description);
        Idea.save(null, 
        {
            success: function(menu) 
            {
                let newItem = {
                    Title: self.Title,
                    Description: self.Description,
                    Creator: Parse.User.current().id
                };
                
                //ViewIdeaPage.ideas.push(newItem);
                self.Title = "";
                self.Description = "";
            },
            error: function(menu, error) 
            {
                console.log('Failed to create new idea, with error code: ' + error.message);
            }
        });
    }
}
