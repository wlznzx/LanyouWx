"use strict";
// Temporary, removed before release

process.env.CAFUI2 = true;

const mWxModule = require("./WebWxModule/wx_module").getInstance();
// let mWxModule = new WxModule();
var Page = require("yunos/page/Page");
const ImageView = require("yunos/ui/view/ImageView");
const View = require("yunos/ui/view/View");
const LayoutManager = require("yunos/ui/markup/LayoutManager");
var imageLoader = require("yunos/util/ImageLoader").getInstance();
const PageLink = require("yunos/page/PageLink");

const TAG = "wltest";

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
        log.I(TAG , "width" + this.window.width);
        log.I(TAG , "height" + this.window.height);
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
        log.I("wltest", "My App Start");

        this.initCallBack();
    }

    initCallBack() {
        mWxModule.on("friend" , (msg) => {
            if (msg !== null) {
                log.I("wltest", msg);
            }
        });
        mWxModule.on("group" , (msg) => {
            log.I("wltest", msg);
        });
        mWxModule.on("qrcode", (url) => {
            log.I("wltest", "v = " + url);
            imageLoader.displayImage(this.QRCodeIV, url);
        });
        mWxModule.on("logged", () => {
            this.QRCodeIV.visibility = View.Visibility.Hidden;
            this.TipsTV.text = "已登录!";

            let link = new PageLink("page://LanyouWx.yunos.com/ChatPage");
            Page.getInstance().sendLink(link);
        });
        mWxModule.on("scaned", () => {
            this.TipsTV.text = "二维码已被扫描，请确认登录!";
        });
        mWxModule.doRun();
    }
}
module.exports = Main;
