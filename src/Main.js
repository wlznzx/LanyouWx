"use strict";
// Temporary, removed before release

process.env.CAFUI2 = true;

// const mWxModule = require("./WebWxModule/wx_module").getInstance();
var Page = require("yunos/page/Page");
const ImageView = require("yunos/ui/view/ImageView");
const View = require("yunos/ui/view/View");
const LayoutManager = require("yunos/ui/markup/LayoutManager");
var imageLoader = require("yunos/util/ImageLoader").getInstance();
const PageLink = require("yunos/page/PageLink");
// const Contact = require("./Contact");
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
        this.mWxModule = require("./WebWxModule/wx_module").getInstance();
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
            let link = new PageLink("page://LanyouWx.yunos.com/ChatPage");
            // link.data = this.mWxModule;
            Page.getInstance().sendLink(link);
        });
        this.mWxModule.on("scaned", () => {
            this.TipsTV.text = "二维码已被扫描，请确认登录!";
        });

        // mWxModule.on("ready", () => {
        //     mWxModule.getHeadimg("hello" , (path) => {
        //         imageLoader.displayImage(this.QRCodeIV, path);
        //     });
        // });
        this.mWxModule.doRun();
    }
}
module.exports = Main;
