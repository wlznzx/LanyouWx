"use strict";

const Page = require("yunos/page/Page");
const BaseAdapter = require("yunos/ui/adapter/BaseAdapter");
const ListView = require("yunos/ui/view/ListView");
const ImageView = require("yunos/ui/view/ImageView");
const View = require("yunos/ui/view/View");
const CompositeView = require("yunos/ui/view/CompositeView");
const resource = require("yunos/content/resource/Resource").getInstance();
const screen = require("yunos/device/Screen").getInstance();
const RelativeLayout = require("yunos/ui/layout/RelativeLayout");
const TextView = require("yunos/ui/view/TextView");
const Color = require("yunos/graphics/Color");
const Contact = require("./WebWxModule/Contact");
const ChatAdapter = require("./adapter/ChatAdapter");
const ContactAdapter = require("./adapter/ContactAdapter");
const RequireRouter = require("./RequireRouter");
const MsgInfo = require("./WebWxModule/MsgInfo");

const TAG = "WebWx_ChatPage";

class ChatPage extends Page {

    onStart() {
        this.initView();
    }

    onLink(link) {
        // console.log("Page->onLink", link);
        log.I(TAG, link.data);
        this.initDatas();
    }

    initView() {
        // this.mWxModule = require("./WebWxModule/wx_module").getInstance();
        this.mWxModule = RequireRouter.getRequire("./WebWxModule/wx_module").getInstance();
        let width = this.window.width;
        let height = this.window.height;

        this.mMainView = new CompositeView();
        this.mMainLayout = new RelativeLayout();
        this.mMainView.layout = this.mMainLayout;
        this.mMainView.width = width;
        this.mMainView.height = height;

        // 左侧最近联系人栏.
        this.mContactLV = new ListView();
        this.mContactLV.width = width / 3;
        this.mContactLV.height = height;

        // 右上侧对话框.
        this.mTitleView = new CompositeView();
        let titleLayout = new RelativeLayout();
        this.mTitleView.layout = titleLayout;
        let contactNameTV = new TextView();
        contactNameTV.fontSize = "18sp";
        contactNameTV.text = "〆木雨";
        this.mTitleView.width = width - this.mContactLV.width;
        this.mTitleView.height = 60;
        let divider = new View(this._context);
        divider.height = 1;
        divider.width = width - this.mContactLV.width;
        divider.id = "divider";
        // divider.background = this._style.dividerColor;
        divider.background = "#003300";
        this.mTitleView.addChild(contactNameTV);
        this.mTitleView.addChild(divider);
        titleLayout.setLayoutParam(0, "align", {left: "parent", middle: "parent"});
        titleLayout.setLayoutParam(0, "margin", {left: 60});
        titleLayout.setLayoutParam("divider", "align", {
            bottom: "parent",
            right: "parent",
            left: "parent"
        });
        // 右下侧最近联系人栏.
        this.mChatLV = new ListView();
        this.mChatLV.width = width - this.mContactLV.width;
        this.mChatLV.height = height - 60;


        this.mMainView.addChild(this.mContactLV); // 0
        this.mMainView.addChild(this.mTitleView); // 1
        this.mMainView.addChild(this.mChatLV); // 2
        this.mMainLayout.setLayoutParam(0, "align", {left: "parent", top: "parent"});
        this.mMainLayout.setLayoutParam(1, "align", {left: {target: 0, side: "right"},top: "parent"});
        this.mMainLayout.setLayoutParam(2, "align", {left: {target: 0, side: "right"},top: {target: 1, side: "bottom"}});
        this.mMainLayout.setLayoutParam(0, "margin", {top: this.window.statusBarHeight});
        this.mMainLayout.setLayoutParam(1, "margin", {top: this.window.statusBarHeight});
        this.window.addChild(this.mMainView);
    }

    initDatas() {
        let Data = new Array();
        for (let i = 0; i < 17; i++) {
            let contact = new Contact("@3535345345", ( "鹏飞" + i));
            Data.push(contact);
        }
        var adapter = new ContactAdapter();
        adapter.data = Data;
        // this.mContactLV.adapter = adapter;

        var data2 = [];
        for (let i = 0; i < 10; i++) {
            data2[i] = "I am " + i;
        }
        var chatAdapter = new ChatAdapter();
        chatAdapter.data = this.getMsgList("@xxxxsdfafas");
        this.mChatLV.adapter = chatAdapter;

        let isLooped = this.mWxModule.isLooped();
        log.I(TAG , "mWxModule.isLooped() = " + isLooped);
        // if (isReady) {
        //     mWxModule.getRecentContacts().then((result) => {
        //         log.I(TAG , result);
        //     });
        // } else {
        this.mWxModule.on("looped", () => {
            log.I(TAG , "on looped.");
        });
        // }
        // this.mWxModule.getRecentContacts().then((result) => {
        //     log.I(TAG , result);
        // });

    }

    getMsgList(FromUserName) {
        if(!this.chatList) {
            this.chatList = new Array();
        }
        for (let i = 0; i < 20; i++) {
            // data2[i] = "I am " + i;
            let _msg = new MsgInfo();
            _msg.setFromUserName(FromUserName);
            _msg.setMsgType(1);
            _msg.setContent("没错，叫我鹏飞！！" + FromUserName);
            this.chatList.push(_msg);
        }
        return this.chatList;
    }
}

// var self = this;
module.exports = ChatPage;
