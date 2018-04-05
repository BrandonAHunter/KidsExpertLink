import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Parse } from 'parse';

 
@Injectable()
export class Data {
private parseAppId: string = 'aMYiAbhppqfmAdA4KyQTyi63DwNBc8TRoSOOLiFa';
private parseJSKey: string='CJmgf6uKtU0m1lZfAudSwT2UQGwIe9sNL3iRyqqL'
private parseServerUrl: string = 'https://parseapi.back4app.com/';

	
  constructor(public Storage: Storage){
 
    Parse.initialize(this.parseAppId, this.parseJSKey);
    Parse.serverURL = this.parseServerUrl;

    console.log('Initiated Parse');

    /*const Menu = Parse.Object.extend('Menu');
    let query = new Parse.Query(Menu);
    query.limit(1000);
    query.find().then((menus) => {
      // resolve(menus);
      console.log(menus.length)
    }, (error) => {
      //reject(error);
    });*/
  }
 
/* setMenuItem(itemName, price, description, category, url, quantity){

//   	let item={
//   	itemName : itemName,
// 	price: price,
//     description: description,
//     category: category,
//     url: url,
//     quantity: quantity= 1,
// };

	// this.saveMenuItem(item);
  
  }


  getDataMenu() {
    //return this.Storage.get('items');
    // return this.items;
    const Menu = Parse.Object.extend('Menu');
    let query = new Parse.Query(Menu);
    query.limit(1000);
    var items=[];
    query.find().then((menus) => {
      // resolve(menus);
      console.log(menus.length);
      
      for (var i = menus.length - 1; i >= 0; i--) {
         var mymenu = {
           itemName:menus[i].get("name"),
           price:menus[i].get("price"),
           category:menus[i].get("category"),
           url:menus[i].get("imageurl")
         }
         items.push(mymenu);
      }
      console.log(items.length);
      return items;

    }, (error) => {
      // reject(error);
      console.log("error");
    });

    return items;

  }
 
  saveMenuItem(item){
  	// this.items.push(item);
   //  let newData = JSON.stringify(item);
   //  this.Storage.set('items', newData);
  }

setOrderItem(itemName, price, description, category, url, quantity, myDate){

    let order={
    itemName : itemName,
      price: price,
    description: description,
    category: category,
    url: url,
    quantity: quantity,
    myDate: myDate, 
};

  this.saveOrderItem(order);
  
  }


  getDataOrder() {
    //return this.Storage.get('items');
    // return this.orders;
  }
 
  saveOrderItem(order){
    // this.orders.push(order);
    // let newData = JSON.stringify(order);
    // this.Storage.set('orders', newData);

    var Order = Parse.Object.extend("Menu");
var menu = new Menu();

menu.set("name", this.itemName);
menu.set("price", parseFloat(this.price));
menu.set("category", this.category);
menu.set("imageurl",this.url);

menu.save(null, {
  success: function(menu) {
    // Execute any logic that should take place after the object is saved.
    alert('New object created with objectId: ' + menu.id);
  },
  error: function(menu, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and message.
    alert('Failed to create new object, with error code: ' + error.message);
  }
});
  }
  */
}