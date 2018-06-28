"use strict";
// Temporary, removed before release

process.env.CAFUI2 = true;

// const mWxModule = require("./WebWxModule/wx_module").getInstance();
const RequireRouter = require("./RequireRouter");
var Page = require("yunos/page/Page");
const ImageView = require("yunos/ui/view/ImageView");
const View = require("yunos/ui/view/View");
const LayoutManager = require("yunos/ui/markup/LayoutManager");
var imageLoader = require("yunos/util/ImageLoader").getInstance();
const PageLink = require("yunos/page/PageLink");
// const Contact = require("./Contact");
const BaseAdapter = require("yunos/ui/adapter/BaseAdapter");
const ListView = require("yunos/ui/view/ListView");
const CompositeView = require("yunos/ui/view/CompositeView");
const resource = require("yunos/content/resource/Resource").getInstance();
const screen = require("yunos/device/Screen").getInstance();
const RelativeLayout = require("yunos/ui/layout/RelativeLayout");
const TextView = require("yunos/ui/view/TextView");
const Color = require("yunos/graphics/Color");
const Contact = require("./WebWxModule/Contact");
const ChatAdapter = require("./adapter/ChatAdapter");
const ContactAdapter = require("./adapter/ContactAdapter");
const TAG = "WebWx_Main";

class Main extends Page {

    onCreate() {
        this.parent = this.window;
    }

    onStart() {
        /*
        var textView = new TextView();
        textView.text = "Hello World";
        textView.width = this.window.width;
        textView.height = this.window.height;
        textView.fontSize = "50sp";
        textView.color = "#FFFFFF";
        textView.background = "#FF66FF";
        textView.align = TextView.Align.Center;
        textView.verticalAlign = TextView.VerticalAlign.Middle;
        this.window.addChild(textView);
        */
        // this.mWxModule = require("./WebWxModule/wx_module").getInstance();
        this.mWxModule = RequireRouter.getRequire("./WebWxModule/wx_module").getInstance();
        LayoutManager.load("main", (err, rootView)=> {
            // if (err) throw err;
            rootView.width = this.window.width;
            rootView.height = this.window.height;
            this.window.addChild(rootView);
            // let mainLayout = rootView.findViewById("MainLayout");
            // mainLayout.height = this.window.height;
            this.QRCodeIV = rootView.findViewById("QRCodeIv");
            this.QRCodeIV.scaleType = ImageView.ScaleType.Center;
            this.TipsTV = rootView.findViewById("TipsTV");
            // putBtn.on("tap", ()=> {
            //     log.D(TAG, "tap", putBtn.text);
            // });
        });
        this.initCallBack();
    }

    initCallBack() {
        this.mWxModule.on("friend" , (msg) => {
            if (msg !== null) {
                // log.I("wltest", msg);
            }
        });
        this.mWxModule.on("group" , (msg) => {
            // log.I("wltest", msg);
        });
        this.mWxModule.on("qrcode", (url) => {
            imageLoader.displayImage(this.QRCodeIV, url);
        });
        this.mWxModule.on("logged", () => {
            // this.QRCodeIV.visibility = View.Visibility.Hidden;
            this.TipsTV.text = "已登录!";
            // let isLooped = this.mWxModule.isLooped();
            // log.I(TAG , "mWxModule.isLooped() = " + isLooped);
            // let link = new PageLink("page://LanyouWx.yunos.com/ChatPage");
            // Page.getInstance().sendLink(link);
            this.window.removeAllChildren();
            this.initView();
        });
        this.mWxModule.on("scaned", () => {
            this.TipsTV.text = "二维码已被扫描，请确认登录!";
        });

        this.mWxModule.on("u_contacts", () => {
            log.I(TAG , "on looped.");
            log.D(TAG , "getRecentContacts..");
            this.mWxModule.getRecentContacts().then((result) => {
                // log.D(TAG , result);
                this.mContactLV.ContactsList = result;
                log.D(TAG, "position = " + result[1].Name);
                // log.D(TAG, "position = " + this.ContactsList[1].Name);
                this.initDatas(result);
            });
        });
        this.mWxModule.doRun();
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

        this.mContactLV.on("itemselect", this.onContactLvSelect);
        this.mContactLV.page = this;
        // 右上侧对话框.
        this.mTitleView = new CompositeView();
        let titleLayout = new RelativeLayout();
        this.mTitleView.layout = titleLayout;
        this.contactNameTV = new TextView();
        this.contactNameTV.fontSize = "18sp";
        this.contactNameTV.text = "〆木雨";
        this.mTitleView.width = width - this.mContactLV.width;
        this.mTitleView.height = 60;
        let divider = new View(this._context);
        divider.height = 1;
        divider.width = width - this.mContactLV.width;
        divider.id = "divider";
        // divider.background = this._style.dividerColor;
        divider.background = "#003300";
        this.mTitleView.addChild(this.contactNameTV);
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

    onContactLvSelect(itemView, position) {
        log.D(TAG, "position = " + position);
        // log.D(TAG, "position = " + this.ContactsList[position].Name);
        // log.D(TAG, itemView);
        log.D(TAG, "onContactLvSelect =" + this.page);
        this.page.contactNameTV.text = this.ContactsList[position].Name;
        itemView.background = "#F2F2F2";
    }



    initDatas(contacts_data) {
        // log.I(TAG , "mWxModule.isLooped() = " + this.mWxModule.isLooped());
        // let Data = new Array();
        // for (let i = 0; i < 10; i++) {
        //     let contact = new Contact("@3535345345", "鹏飞");
        //     Data.push(contact);
        // }
        log.I(TAG , "contacts_data = " + contacts_data.length);
        var adapter = new ContactAdapter(this.mWxModule);
        adapter.data = contacts_data;
        this.mContactLV.adapter = adapter;

        var data2 = [];
        for (let i = 0; i < 10; i++) {
            data2[i] = "I am " + i;
        }
        var chatAdapter = new ChatAdapter();
        chatAdapter.data = data2;
        this.mChatLV.adapter = chatAdapter;
        let isLooped = this.mWxModule.isLooped();
        log.I(TAG , "mWxModule.isLooped() = " + isLooped);
    }
}
module.exports = Main;
