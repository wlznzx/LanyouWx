"use strict";

class MsgInfo {
  constructor(fromusername, msgtype, content) {
      this.FromUserName = fromusername;
      this.MsgType = msgtype;
      this.Content = content;
  }

  getFromUserName(){
      return this.FromUserName;
  }

  setFromUserName(fromusername){
      this.FromUserName = fromusername;
  }

  getMsgType(){
      return this.MsgType;
  }

  setMsgType(msgtype){
      this.MsgType = msgtype;
  }

  getContent(){
      return this.Content;
  }

  setContent(content){
      this.Content = content;
  }
}
module.exports = MsgInfo;
