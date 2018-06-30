"use strict";

const fs = require('fs');
const BaseAdapter = require("yunos/ui/adapter/BaseAdapter");
const ListView = require("yunos/ui/view/ListView");
const ImageView = require("yunos/ui/view/ImageView");
const View = require("yunos/ui/view/View");
const CompositeView = require("yunos/ui/view/CompositeView");
const resource = require("yunos/content/resource/Resource").getInstance();
const TextView = require("yunos/ui/view/TextView");
const screen = require("yunos/device/Screen").getInstance();
const RelativeLayout = require("yunos/ui/layout/RelativeLayout");
const ColumnLayout = require("yunos/ui/layout/ColumnLayout");
var imageLoader = require("yunos/util/ImageLoader").getInstance();
var getPixelByDp = screen.getPixelByDp;

const TAG = "WebWx_ContactAdapter";

const IMG_PATH = "/opt/data/share/LanyouWx.yunos.com/";

class ContactAdapter extends BaseAdapter {

    constructor(_module) {
      super();
      this.mWxModule = _module;
    }
    // this.mWxModule.getHeadimg(this.data[position].UserName, (path) => {
    //         // imageLoader.displayImage(convertView.icon, path);
    //         // convertView.icon = resource.getImageSrc(path);
    // });
    createItem(position, convertView) {
        // log.D(TAG, this.data[position]);
        // if (!convertView) {
        //     convertView = new ListView.ListItem();
        //     convertView.type = ListView.ListItem.Type.DEFAULT;
        // }
        // convertView.icon = resource.getImageSrc("/opt/data/share/LanyouWx.yunos.com/_@@29067a4e90c8c6985ed81f8db19cd833b5cf73394c3105cd1e6c4535a0867411.jpg");
        // convertView.title = this.data[position].Name;
        // convertView.detail = "青春洋溢的少年.";
        // return convertView;

        if (!convertView) {
            convertView = this._buildMsgLayout(position);
        }
        
        let context_tv = convertView.findViewById("content");
        context_tv.text = this.data[position].Name;
        let avatar_iv = convertView.findViewById("avatar");
        if (this.mWxModule) {
            let _path = IMG_PATH + "_" + this.data[position].UserName + ".jpg";
            log.D(TAG , "1111 = " + _path);
            if (fs.existsSync(_path)) {
                log.D(TAG , "do re_path = " + _path);
                imageLoader.displayImage(avatar_iv, _path);
            } else {
                this.mWxModule.getHeadimg(this.data[position].UserName, (path) => {
                    log.D(TAG , "download = " + path);
                    imageLoader.displayImage(avatar_iv, path);
                });
            }
        }
        // convertView = this._buildMsgLayout(position);
        return convertView;
    }

    _buildMsgLayout(position) {
        let ret = new CompositeView();
        let layout = new RelativeLayout();
        ret.layout = layout;
        let height = 55;
        ret.height = screen.getPixelByDp(height);
        ret.width = 200;
        var iv = new ImageView();
        var ivSize = screen.getPixelByDp(height - 20);

        iv.borderRadius = 15;
        iv.id = "avatar";
        iv.width = ivSize;
        iv.height = ivSize;
        iv.scaleType = ImageView.ScaleType.Fitxy;
        // iv.src = resource.getImageSrc("images/icons/pf.jpg");
        ret.addChild(iv);

        // if (this.mWxModule) {
        //     let _path = IMG_PATH + "_" + this.data[position].UserName;
        //     if (fs.existsSync(_path)) {
        //         log.D(TAG , "do re_path = " + _path);
        //         imageLoader.displayImage(iv, _path);
        //     } else {
        //         this.mWxModule.getHeadimg(this.data[position].UserName, (path) => {
        //             imageLoader.displayImage(iv, path);
        //         });
        //     }
        // }

        let tv = new TextView();
        tv.id = "content";
        tv.fontSize = "12sp";
        // let tv.text = this.data[position].Name;
        ret.addChild(tv);

        // let tv = this.createSummary();
        // ret.addChild(tv);

        let divider = new View(this._context);
        divider.height = 1;
        divider.id = "divider";
        divider.background = "#e5e5e5";
        ret.addChild(divider);

        ret.background = "#FFFFFF";
        // this.configMultiState(ret);
        layout.setLayoutParam(0, "align", {left: "parent",middle: "parent"});
        layout.setLayoutParam(1, "align", {left: {target: 0, side: "right"},top: "parent"});
        layout.setLayoutParam(0, "margin", {left: screen.getPixelByDp(5)});
        layout.setLayoutParam(1, "margin", {top: screen.getPixelByDp(15)});
        layout.setLayoutParam(1, "margin", {left: screen.getPixelByDp(15)});
        this.applyDividerLayout(layout);


        // container.layout = ret;
        // var contentH = textZone.layout._contentHeight + 2 * this._style.paddingTop;
        // container.height = this.realHeight(this._style.defaultHeight, contentH);
        // this._icon = iv;
        // container.addChild(iv);
        // this.createItem(container, false);
        // this.buildDefault();
        // log.D(TAG, ret._context);
        return ret;
    }



    buildDefault() {
        var container = new CompositeView();
        // var textZone = this.createTextZone();
        let ret = this.createDefaultItemLayout();
        this.applyDividerLayout(ret);
        ret.setLayoutParam("divider", "margin", {
            // left: this._style.dividerMarginLeft
            left: 5
        });
        container.layout = ret;
        // textZone.layout.perform(textZone);
        // var contentH = textZone.layout._contentHeight + 2 * this._style.paddingTop;
        container.height = 80;
        var iv = new ImageView(this._context);
        var ivSize = 80;
        iv.scaleType = ImageView.ScaleType.Fitcenter;
        iv.width = ivSize;
        iv.height = ivSize;
        this._icon = iv;
        container.addChild(iv);
        // container.addChild(textZone);
        this._createItem(container, false);
    }

    createSummary() {
        var summary = new TextView();
        // summary.height = getPixelByDp(30);
        summary.fontSize = getPixelByDp(12);
        // summary.color = this._style.textColorLight;
        summary.color = "#e5e5e5";
        summary.multiLine = true;
        summary.lineSpacing = 10;
        summary.align = TextView.Align.Left;
        summary.visibility = View.Visibility.None;
        // this.configTextViewMultiState(summary);
        // this._summary = summary;
        return summary;
    }

    _createItem(container, appendDetail = true) {
        this.configMultiState(container);
        if (!this._divider) {
            this._divider = new View(this._context);
            this._divider.height = 1;
            this._divider.id = "divider";
            // this._divider.background = this._style.dividerColor;
        }
        // if (!this._shadowView) {
        //     this._shadowView = new View(this._context);
        //     this._shadowView.id = "shadow";
        //     this._shadowView.height = this._style.shadowHeight;
        //     this._shadowView.background = this._style.shadow;
        //     this._shadowView.visibility = View.Visibility.None;
        // }
        // container.addChild(this._divider);
        //
        // this.addChild(container);
        // this.addChild(this._shadowView);
        // this.createLayout();
        // this.layout = ListItem._layout;
        this.height = container.height;
    }

    configMultiState(view) {
        view.multiState = {
            normal: {
                background: "#FFFFFF",
                opacity: 1
            },
            pressed: {
                background: "#F2F2F2",
                opacity: 1
            },
            disabled: {
                background: "#FFFFFF",
                opacity: 0.4
            }
        };
    }

    createDefaultItemLayout() {
        let ret = new RelativeLayout();
        // let marginWidth = this._style.paddingLeft;
        let marginWidth = 15;
        ret.setLayoutParam(0, "align", {
            middle: "parent",
            left: "parent"
        });
        ret.setLayoutParam(0, "margin", {
            left: marginWidth
        });
        ret.setLayoutParam(1, "align", {
            middle: "parent",
            left: {
                target: 0,
                side: "right"
            },
            right: "parent"
        });
        ret.setLayoutParam(1, "margin", {
            left: marginWidth,
            right: marginWidth
        });
        ret.setLayoutParam("accessory", "align", {
            middle: "parent",
            right: "parent"
        });
        ret.setLayoutParam("accessory", "margin", {
            right: marginWidth
        });
        this.applyDividerLayout(ret);
        return ret;
    }

    applyDividerLayout(layout) {
        layout.setLayoutParam("shadow", "align", {
            bottom: "parent",
            right: "parent",
            left: "parent"
        });
        layout.setLayoutParam("divider", "align", {
            bottom: "parent",
            right: "parent",
            left: "parent"
        });
    }

}

module.exports = ContactAdapter;
