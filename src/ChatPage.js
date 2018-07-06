"use strict";

const Page = require("yunos/page/Page");
const BaseAdapter = require("yunos/ui/adapter/BaseAdapter");
const ListView = require("yunos/ui/view/ListView");
const ImageView = require("yunos/ui/view/ImageView");
const SpriteView = require("yunos/ui/view/SpriteView");
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

const Image = require("yunos/multimedia/Image");
const Bitmap = require("yunos/graphics/Bitmap");
const MediaPlayer = require("yunos/multimedia/MediaPlayer");

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

        log.D(TAG, "width = " + width);
        log.D(TAG, "height = " + height);

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
        titleLayout.setLayoutParam(0, "align", { left: "parent", middle: "parent" });
        titleLayout.setLayoutParam(0, "margin", { left: 60 });
        titleLayout.setLayoutParam("divider", "align", {
            bottom: "parent",
            right: "parent",
            left: "parent"
        });
        // 右下侧最近联系人栏.
        this.mChatLV = new ListView();
        this.mChatLV.width = width - this.mContactLV.width;
        this.mChatLV.height = height - 60;

        var ImagePath = resource.getImageSrc("/images/qqface.png");
        var bitmap1 = new Image(ImagePath).getBitmap();
        var bitmap2 = new Image(ImagePath).getBitmap();

        var imagedata = bitmap1.getImageData(0, 0, 30, 30);
        bitmap2.putImageData(imagedata, 0, 0, 0, 0, 30, 30);

        var imageview = new ImageView();
        imageview.id = "iiiv";
        imageview.src = bitmap2;

        this.mMainView.addChild(this.mContactLV); // 0
        this.mMainView.addChild(this.mTitleView); // 1
        this.mMainView.addChild(this.mChatLV); // 2

/*
        const spriteView = new SpriteView();
        spriteView.width = 50;
        spriteView.height = 50;
        spriteView.src = resource.getImageSrc("./images/voice.png");
        spriteView.frameWidth = 25;
        spriteView.frameHeight = 25;
        spriteView.frameDuration = 150;
        spriteView.frameCount = 3;
        this.mMainView.addChild(spriteView);
        spriteView.start();
*/
        this.mChatLV.on("itemselect", function (itemView, position) {
            if (itemView.Url) {
                var PageLink = require("yunos/page/PageLink");
                let link = new PageLink("page://browser.yunos.com/browser");
                let data = { url: itemView.Url };
                link.data = JSON.stringify(data);
                Page.getInstance().sendLink(link);
            }
        });
        // this.mMainView.addChild(imageview);
        this.mMainLayout.setLayoutParam(0, "align", { left: "parent", top: "parent" });
        this.mMainLayout.setLayoutParam(1, "align", { left: { target: 0, side: "right" }, top: "parent" });
        this.mMainLayout.setLayoutParam(2, "align", { left: { target: 0, side: "right" }, top: { target: 1, side: "bottom" } });
        this.mMainLayout.setLayoutParam(3, "align", { center: "parent", middle: "parent" });
        this.mMainLayout.setLayoutParam("iiiv", "align", { center: "parent", middle: "parent" });
        this.mMainLayout.setLayoutParam(0, "margin", { top: this.window.statusBarHeight });
        this.mMainLayout.setLayoutParam(1, "margin", { top: this.window.statusBarHeight });
        this.mMainLayout.setLayoutParam(2, "margin", { bottom: 60 });
        this.window.addChild(this.mMainView);
    }

    initDatas() {
        let Data = new Array();
        for (let i = 0; i < 17; i++) {
            let contact = new Contact("@3535345345", ("鹏飞" + i), "");
            contact.hasNewMsg = true;
            Data.push(contact);
        }
        var adapter = new ContactAdapter();
        adapter.data = Data;
        this.mContactLV.adapter = adapter;


        var chatAdapter = new ChatAdapter();
        this.mChatLV.adapter = chatAdapter;
        this.mChatLV.arriveAt(19);
        chatAdapter.data = this.getMsgList("@xxxxsdfafas");
        this.mChatLV.arriveAt(19);
        this.mChatLV.dividerHeight = 20;
        // if (isReady) {
        //     mWxModule.getRecentContacts().then((result) => {
        //         log.I(TAG , result);
        //     });
        // } else {
        this.mWxModule.on("looped", () => {
            log.I(TAG, "on looped.");
        });
        // }
        // this.mWxModule.getRecentContacts().then((result) => {
        //     log.I(TAG , result);
        // });
        //

        this.sMediaPlayer = new MediaPlayer(MediaPlayer.PlayerType.LOWPOWERAUDIO);
        this.playVoice("/opt/data/share/LanyouWx.yunos.com/_8690156483247251196.mp3");
        // this.playVoice("/usr/bin/ut/res/audio/sp.mp3");
        this.sMediaPlayer.on("prepared", function (result) {
            log.D(TAG, "MediaPlayer prepared.");
            // this.sMediaPlayer.start();
        });

        this.sMediaPlayer.on("playbackcomplete", function () {
            // 播放完成
            log.D(TAG, "MediaPlayer playbackcomplete.");
            if (this.sMediaPlayer) {
                this.sMediaPlayer.reset();
            }
            if (this.playingAnimView) {
                this.playingAnimView.stop();
            }
        });

        this.sMediaPlayer.on("started", function () {
            // 已开始播放
            log.D(TAG, "MediaPlayer started.");
        });

        this.sMediaPlayer.on("error", function (errorCode) {
            // 发生了错误，可以根据具体的错误码进行相应的处理
            log.D(TAG, "MediaPlayer error.");
        });
    }

    playVoice(path) {
        if (!this.sMediaPlayer) {
            return;
        }
        log.E(TAG, "playVoice path = " + path);
        // try {
            this.sMediaPlayer.setURISource(path);
            this.sMediaPlayer.prepareSync();
            this.sMediaPlayer.start();
        // } catch (e) {
        //     log.E(TAG, "PlayVoice Error.", e);
        // }
    }

    getMsgList(FromUserName) {
        if (!this.chatList) {
            this.chatList = new Array();
        }
        for (let i = 0; i < 20; i++) {
            // data2[i] = "I am " + i;
            let _msg = new MsgInfo();
            _msg.setFromUserName(FromUserName);
            _msg.WithUserName = "@8a7d01877cc8f2d6ec9ebb608c630b810dbd2c9c7a754ba22257a59d49e69cfc";
            _msg.IsReceive = true;
            _msg.MsgType = "34";
            _msg.Content = "。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。" +
                "。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。" +
                "。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。" +
                "。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。" +
                "。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。" + i;
            _msg.CreateTime = "1530339945";
            _msg.VoiceLength = 13000;
            _msg.IsGroup = false;
            _msg.GroupMember = "";
            _msg.Url = "http://apis.map.qq.com/uri/v1/geocoder?coord=22.540672,114.093910";
            _msg._id = "I5WMj3rt4nNW70mb";
            this.chatList.push(_msg);
        }

        let _msg = new Object();
        _msg.WithUserName = "";
        this.chatList.push(_msg);
        return this.chatList;
    }
}

// var self = this;
module.exports = ChatPage;
