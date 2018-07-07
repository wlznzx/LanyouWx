"use strict";

class Contact {
  constructor(username, name, lastmsg) {
      this.UserName = username;
      this.Name = name;
      this.LastMsg = lastmsg;
  }

  getName(){
      return this.Name;
  }

  setName(name){
      this.Name = name;
  }

  getUserName(){
      return this.UserName;
  }

  setUserName(username){
      this.UserName = username;
  }

  getLastMsg(){
      return this.LastMsg;
  }

  setLastMsg(lastmsg){
      this.LastMsg = lastmsg;
  }
}
module.exports = Contact;
