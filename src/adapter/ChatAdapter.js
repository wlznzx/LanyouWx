"use strict";

const fs = require('fs');
const BaseAdapter = require("yunos/ui/adapter/BaseAdapter");
const ListView = require("yunos/ui/view/ListView");
const ImageView = require("yunos/ui/view/ImageView");
const View = require("yunos/ui/view/View");
const CompositeView = require("yunos/ui/view/CompositeView");
const RelativeLayout = require("yunos/ui/layout/RelativeLayout");
const resource = require("yunos/content/resource/Resource").getInstance();
const TextView = require("yunos/ui/view/TextView");
const screen = require("yunos/device/Screen").getInstance();
var imageLoader = require("yunos/util/ImageLoader").getInstance();

const TAG = "WebWx_ChatAdapter";
const IMG_PATH = "/opt/data/share/LanyouWx.yunos.com/";


class ChatAdapter extends BaseAdapter {

    constructor(_module) {
      super();
      this.mWxModule = _module;
    }

    createItem(position, convertView) {
        // log.I("TAG", "ChatAdapter position = " + position);
        // if (!convertView) {
        convertView = this.buildMsgLayout(position);
        // }
        return convertView;
    }

    buildMsgLayout(position) {
        let ret = new CompositeView();
        let layout = new RelativeLayout();
        ret.layout = layout;
        var iv = new ImageView();
        var ivSize = 40;
        iv.id = "avatar";
        iv.width = ivSize;
        iv.height = ivSize;
        iv.scaleType = ImageView.ScaleType.Fitxy;

        ret.addChild(iv);
        let tv = new TextView();
        tv.id = "content";
        tv.fontSize = "10sp";
        ret.addChild(tv);
        if (!this.data[position].IsReceive) {
            layout.setLayoutParam(0, "align", {right: "parent",middle: "parent"});
            layout.setLayoutParam(1, "align", {right: {target: 0, side: "left"},middle: "parent"});
            layout.setLayoutParam(0, "margin", {right: screen.getPixelByDp(30)});
            layout.setLayoutParam(1, "margin", {right: screen.getPixelByDp(5)});
            ret.height = 400;
        } else {
            ret.height = 60;
            layout.setLayoutParam(0, "align", {left: "parent",middle: "parent"});
            layout.setLayoutParam(1, "align", {left: {target: 0, side: "right"},middle: "parent"});
            layout.setLayoutParam(0, "margin", {left: screen.getPixelByDp(30)});
            layout.setLayoutParam(1, "margin", {left: screen.getPixelByDp(5)});
        }
        ret.height = 60;
        ret.width = 400;
        // container.layout = ret;
        // var contentH = textZone.layout._contentHeight + 2 * this._style.paddingTop;
        // container.height = this.realHeight(this._style.defaultHeight, contentH);
        // this._icon = iv;
        // container.addChild(iv);
        // this.createItem(container, false);
        //
        this.bindData(ret, position);
        return ret;
    }

    bindData(convertView, position) {
        log.D(TAG , "bindData = " + position);
        log.D(TAG , this.data[position]);
        if(this.data[position].WithUserName == "") return;

        let content_tv = convertView.findViewById("content");
        content_tv.text = this.data[position].Content;
        let avatar_iv = convertView.findViewById("avatar");
        if (!this.data[position].IsReceive) {
            this.data[position].WithUserName = this.mWxModule.my.UserName;
        }
        let _path = IMG_PATH + "_" + this.data[position].WithUserName + ".jpg";
        if (fs.existsSync(_path)) {
            // log.D(TAG , "do re_path = " + _path);
            imageLoader.displayImage(avatar_iv, _path);
        } else if (this.mWxModule) {
            this.mWxModule.getHeadimg(this.data[position].WithUserName, (path) => {
                imageLoader.displayImage(avatar_iv, path);
            });
        }
    }


}

module.exports = ChatAdapter;
