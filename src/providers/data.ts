import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Parse } from 'parse';

 
@Injectable()
export class Data 
{
    private parseAppId: string = 'aMYiAbhppqfmAdA4KyQTyi63DwNBc8TRoSOOLiFa';
    private parseJSKey: string='CJmgf6uKtU0m1lZfAudSwT2UQGwIe9sNL3iRyqqL'
    private parseServerUrl: string = 'https://parseapi.back4app.com/';

    private Ideas;

    private UserList = [];
    private IdeaList = [];

    private LinkIdeaIdList = [];

    private currentUserId: string = "";
    private typeOfUser: string = "";
	
    constructor(public Storage: Storage){
 
        Parse.initialize(this.parseAppId, this.parseJSKey);
        Parse.serverURL = this.parseServerUrl;

        console.log('Initiated Parse');

        //Do not load storage until the user logs in
    }
    
    public load()
    {
        this.UserList = [];
        this.IdeaList = [];
        this.LinkIdeaIdList = [];

        this.currentUserId = Parse.User.current().id;

        this.Ideas = Parse.Object.extend('Idea');
        var ideaQuery = new Parse.Query(this.Ideas);

        var self = this;

        var Users = Parse.Object.extend('User');
        var userQuery = new Parse.Query(Users);
        userQuery.find({
            success: function(users) 
            {
                for (var i = 0; i < users.length; i++) 
                {
                    let User = {
                        id: users[i].id,
                        Name: users[i].get("firstName") + " " + users[i].get("lastName"),
                        Email: users[i].get("contactEmail"),
                        Phone: users[i].get("phone")
                    };
                    self.UserList.push(User);

                    if (users[i].id == self.currentUserId)
                    {
                        self.typeOfUser = users[i].get("TypeOfUser");
                    }
                }
            },
            error: function(error) 
            {
                console.log("Error: " + error.code + " " + error.message);
            }
        }).then(function(obj) 
        {
            var LinkItem = Parse.Object.extend('Linked');
            var linkQuery = new Parse.Query(LinkItem);
            linkQuery.find({
                success: function(links) 
                {
                    for (var i = 0; i < links.length; i++)
                    {
                        if (self.currentUserId == links[i].get("expert"))
                        {
                            self.LinkIdeaIdList.push(links[i].get("ideaId"));
                        }
                    }
                },
                error: function(error) { }
            }).then(function()
            {
                ideaQuery.find({
                    success: function(results) 
                    {
                        // Do something with the returned Parse.Object values
                        console.log(results.length);
                        for (var i = 0; i < results.length; i++) 
                        {
                            if (results[i] != undefined)
                            {
                                let id = results[i].id;
                                let title = results[i].get("Title");
                                let description = results[i].get("Description");
                                let creator = results[i].get("CreatedBy");

                                for (var j = 0; j < self.UserList.length; j++)
                                {
                                    let user = self.UserList[j];
                                    if (user != undefined && user.id == creator)
                                    {
                                        let newItem = {
                                            IdeaId: id,
                                            Title: title,
                                            Description: description,
                                            Creator: creator,
                                            Name: user.Name,
                                            Email: user.Email,
                                            Phone: user.Phone
                                        };
                                        
                                        if (self.typeOfUser == "Student" && creator == self.currentUserId)
                                        {
                                            self.LinkIdeaIdList.push(id);
                                        }
                                        
                                        self.IdeaList.push(newItem);
                                        break;
                                    }
                                }
                            }
                        }
                        
                        if (self.IdeaList.length > 1)
                        {
                            self.IdeaList.sort(function(itemA, itemB)
                            {
                                if(itemA.Title < itemB.Title) 
                                {
                                    return -1;
                                }
                                if(itemA.Title > itemB.Title) 
                                {
                                    return 1
                                }
                                return 0;
                            });
                        }
                    }, error: function(error) 
                    {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            });
        });
    }

    public get IdeaItemsList(): any[]
    {
        return this.IdeaList;
    }

    public get LinkedItemsList(): any[]
    {
        let links = [];
        for (var i = 0; i < this.IdeaList.length; i++)
        {
            if (this.LinkIdeaIdList.indexOf(this.IdeaList[i].IdeaId) != -1)
            {
                links.push(this.IdeaList[i]);
            }
        }
        return links;
    }

    public get UsersList(): any[]
    {
        return this.UserList;
    }

    public getUserById(userId: string): any
    {    
        for (var i = 0; i < this.UserList.length; i++)
        {
            if (this.UserList[i].id == userId)
            {
                return this.UserList[i];
            }
        }
        return undefined;
    }

    public getIsLinkedToIdea(ideaId: string)
    {
        return this.LinkIdeaIdList.indexOf(ideaId) != -1
    }

    public toggleLink(ideaId: string, expertId: string, studentId: string)
    {
        let self = this;
        var linkExists = false;

        var LinkItem = Parse.Object.extend('Linked');
        var linkQuery = new Parse.Query(LinkItem);
        linkQuery.equalTo("ideaId", ideaId);
        linkQuery.first({
            success: function(result) 
            {
                if (result)
                {
                    //Remove the link between the expert and the student
                    result.destroy({
                        success: function(response) 
                        {
                            self.LinkIdeaIdList.splice(self.LinkIdeaIdList.indexOf(ideaId), 1);
                            console.log('item erased successfully');
                        },
                        error: function(response, error) {
                            console.log('Error: '+ error.message);
                        }
                    });

                    linkExists = true;
                }
            },
            error: function(error) { }
        }).then(function()
        {
            //Create the link between the expert and the student
            if (!linkExists)
            {
                let newLinkItem = new LinkItem();
                newLinkItem.set("expert", expertId);
                newLinkItem.set("student", studentId);
                newLinkItem.set("ideaId", ideaId);
                newLinkItem.save(null, {
                    success: function (entry) 
                    {
                        self.LinkIdeaIdList.push(ideaId);
                    },
                    error: function (response, error) 
                    {
                        console.log('Error: ' + error.message);
                    }
                });
            }
        });
    }

    public addIdea(creatorId: string, title: string, description: string)
    {
        var self = this;

        var Idea = new this.Ideas();
        Idea.set('CreatedBy', creatorId);
        Idea.set('Title', title);
        Idea.set('Description', description);
        Idea.save(null, 
        {
            success: function(idea) 
            {
                console.log("idea added");
                var user = Parse.User.current();
                user.fetch().then(function(fetchedUser)
                {
                    let newItem = {
                        IdeaId: idea.id,
                        Title: title,
                        Description: description,
                        Creator: creatorId,
                        Name: fetchedUser.get("firstName") + " " + fetchedUser.get("lastName"),
                        Email: fetchedUser.get("contactEmail"),
                        Phone: fetchedUser.get("phone")
                    };
                    
                    if (self.typeOfUser == "Student")
                    {
                        self.LinkIdeaIdList.push(idea.id);
                    }
                    self.IdeaList.push(newItem);
                }, 
                function(error)
                {
                    //Handle the error
                });
            },
            error: function(menu, error) 
            {
                console.log('Failed to create new idea, with error code: ' + error.message);
            }
        });
    }

    public editIdea(ideaId: string, creatorId: string, title: string, description: string)
    {
        for (var i = 0; i < this.IdeaList.length; i++)
        {    
            let idea = this.IdeaList[i];
            if (idea.IdeaId == ideaId)
            {
                idea.Title = title;
                idea.Description = description;
                break;
            }
        }

        let query = new Parse.Query(this.Ideas);
        query.equalTo("objectId", ideaId);
        query.first({
            success: function (entry) 
            {
                if (entry) 
                {
                    entry.set("Title", title);
                    entry.set("Description", description);
                    entry.save(null, {
                        success: function (item) 
                        {
                            console.log('idea updated successfully');
                        },
                        error: function (response, error) 
                        {
                            console.log('Error: ' + error.message);
                        }
                    });
                }
            },
            error: function (error) 
            {
                console.log("Error: " + error.code + " " + error.message);
            }
        });
    }

    public removeIdea(ideaId: string)
    {   
        let ideaIndex = -1;
        for (let i = 0; i < this.IdeaList.length; i++)
        {
            if (this.IdeaList[i].IdeaId == ideaId)
            {
                ideaIndex = i;
                break;
            }
        }

        if (ideaIndex != -1)
        {
            this.IdeaList.splice(ideaIndex, 1);
        }
        
        let query = new Parse.Query(this.Ideas);
        query.equalTo("objectId", ideaId);
        query.first({
            success: function (entry) 
            {
                if (entry) 
                {
                    entry.destroy({
                        success: function(response) 
                        {
                            console.log('removed idea succesfully');
                        },
                        error: function(response, error) 
                        {
                            console.log('Error: '+ error.message);
                        }
                    });
                }
            },
            error: function (error) 
            {
                console.log("Error: " + error.code + " " + error.message);
            }
        });
    }

    //verify that the email is valid before calling this method
    //Update the Idea List in memory. This does not affect the database
    public updateUser(firstName: string, lastName: string, email: string, phone: string)
    {
        for (var i = 0; i < this.UserList.length; i++)
        {
            let user = this.UserList[i];
            if (user.id)
            {
                user.Name = firstName + " " + lastName;
                user.Email = email;
                user.Phone = phone;

                for (var j = 0; j < this.IdeaList.length; j++)
                {
                    let idea = this.IdeaList[j];
                    if (idea.Creator == user.id)
                    {
                        idea.Name = user.Name;
                        idea.Email = user.Email;
                        idea.Phone = user.Phone;
                        break;
                    }
                }

                break;
            }
        }
    }
}