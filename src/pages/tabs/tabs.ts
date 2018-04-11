import { Component } from '@angular/core';
import { Parse } from 'parse';

import { Data } from '../../providers/data';

import { CreateIdeaPage } from '../create-idea/create-idea';
import { ProfilePage } from '../profile/profile';
import { SearchIdeaPage } from '../search-idea/search-idea';
import { ViewIdeaPage } from '../view-idea/view-idea';
import { ViewLinkedPage } from '../view-linked/view-linked';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage 
{
    title1;
    tab1Root;
    title2;
    tab2Root;
    tab3Root = ProfilePage;

    constructor() 
    {
        var currentUser = Parse.User.current();
        var type = currentUser.get('TypeOfUser');
        console.log(type);

        if (type == 'Professional')
        {
          this.title1 = 'Search Idea'
          this.tab1Root = SearchIdeaPage;
          this.title2 = 'Linked Ideas'
          this.tab2Root = ViewLinkedPage;
        } 
        else 
        {
          this.title1 = 'Create Idea'
          this.tab1Root = CreateIdeaPage;
          this.title2 = 'My Ideas'
          this.tab2Root = ViewIdeaPage;
        }
    }
}
