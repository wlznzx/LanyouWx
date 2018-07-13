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
const AudioManager = require("yunos/device/AudioManager");
const Image = require("yunos/multimedia/Image");
const Bitmap = require("yunos/graphics/Bitmap");
const MediaPlayer = require("yunos/multimedia/MediaPlayer");
const TTSPlayer = require("yunos/speech/TTSPlayer");

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


        var ttsPlayer = new TTSPlayer();

        ttsPlayer.on("initialized", function () {
            ttsPlayer.play("我是张桓，我爱济源;");
        });

        ttsPlayer.on("begin", function () {
            // 开始进行语音播报
        });

        ttsPlayer.on("end", function () {
            // 语音播报结束
        });

        ttsPlayer.on("error", function (errCode, description) {
        });

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
        this.sMediaPlayer.setAudioStreamType(AudioManager.StreamType.AUDIO_STREAM_MUSIC);
        // this.playVoice("https://wx2.qq.com/cgi-bin/mmwebwx-bin/webwxgetvoice?msgid=5165589984116123686&skey=@crypt_81051821_deb7d8f804bdbde84054005ee1608821");
        // this.playVoice('/opt/data/share/LanyouWx.yunos.com/_4521707765874170551.mp3');
        this.playVoice("/opt/data/share/common/_4521707765874170551.mp3");
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

        let _headers = {
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Referer': 'https://wx2.qq.com/',
            'Accept-Language': 'zh-CN',
            'Accept-Encoding': 'gzip, deflate, br',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36',
            'Host': 'wx2.qq.com',
            'Connection': 'Keep-Alive',
            'Range': 'bytes=0-',
            'Cookie': 'webwxuvid=449b6ded4c3bec577b24bbc08521f19091bfb53f1b30758d768d0333cfb66f7104cd8d2f8df049979521a3e842b109ce; pgv_pvi=9398682624; pgv_pvid=8145106167; MM_WX_NOTIFY_STATE=1; uin=null; skey=null; luin=null; lskey=null; user_id=null; session_id=null; MM_WX_SOUND_STATE=1; last_wxuin=1952323612; wxuin=1952323612; login_frequency=1; mm_lang=zh_CN; wxpluginkey=1530940442; wxsid=7Cl6oCrRDy+chBwX; webwx_data_ticket=gScmAU6F+BZJ4mWylqbY/fc/; webwx_auth_ticket=CIsBENOwie4MGoAB8iB1KT+5fLdcME2Fepzwvscsqz5VDKRDWOq8Leoz7EOR3u9rrT6yk7pnoTB7pCLV9B/uMjnBxYT2xbYL7Alhgj961xD7JV4zYct2S8CZhgVqk5pVllU+k1M71PkLFJLtIabJDVz48UjigpI6wC6imiWPkTfAQEYtuO9g+WoDUOE=; wxloadtime=1530945754_expired'
        }

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
