"use strict";
// Temporary, removed before release

process.env.CAFUI2 = true;

const WxModule = require("./WebWxModule/wx_module");
let mWxModule = new WxModule();
var Page = require("yunos/page/Page");
const ImageView = require("yunos/ui/view/ImageView");
const LayoutManager = require("yunos/ui/markup/LayoutManager");
var imageLoader = require("yunos/util/ImageLoader").getInstance();
const TAG = "wltest";

class Main extends Page {
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
        let textView;
        let QRCodeIV;
        let putBtn;

        log.I(TAG , "width" + this.window.width);
        log.I(TAG , "height" + this.window.height);
        LayoutManager.load("main", (err, rootView)=> {
            // if (err) throw err;
            rootView.width = this.window.width;
            rootView.height = this.window.height;
            this.window.addChild(rootView);
            // let mainLayout = rootView.findViewById("MainLayout");
            // mainLayout.height = this.window.height;

            textView = rootView.findViewById("textView");
            QRCodeIV = rootView.findViewById("QRCodeIv");
            QRCodeIV.scaleType = ImageView.ScaleType.Center;
            putBtn = rootView.findViewById("TipsTV");
            textView.text = "Value: 0";

            putBtn.on("tap", ()=> {
                log.D(TAG, "tap", putBtn.text);
            });
        });
        log.I("wltest", "My App Start");

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
            imageLoader.displayImage(QRCodeIV, url);
        });
        mWxModule.doRun();
    }
}
module.exports = Main;
