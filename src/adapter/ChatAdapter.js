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
        if (this.data[position].Url) {
            convertView = this.buildLocationMsgLayout(position);
        } else {
            convertView = this.buildMsgLayout(position);
        }
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
        tv.maxWidth = 350;
        tv.multiLine = true;
        // log.D(TAG, "position content = " + this.data[position].Content);

        if (this.data[position].Content) {
            // tv.capInsets = [10, 10, 20, 2];
            // tv.capInsets = [10, 10, 20, 2];
            tv.text = this.data[position].Content;
            // tv.background = resource.getImageSrc("images/chat_rev_bg.9.png");
        }
        var realWidth = tv.contentWidth;
        var realHeight = tv.contentHeight;

        // log.D(TAG, "realWidth = " + realWidth);
        // log.D(TAG, "realHeight = " + realHeight);
        ret.addChild(tv);
        if (!this.data[position].IsReceive) {
            layout.setLayoutParam(0, "align", { right: "parent" });
            layout.setLayoutParam(1, "align", { right: { target: 0, side: "left" }, middle: "parent" });
            layout.setLayoutParam(0, "margin", { right: screen.getPixelByDp(30) });
            layout.setLayoutParam(1, "margin", { right: screen.getPixelByDp(5) });
        } else {
            layout.setLayoutParam(0, "align", { left: "parent" });
            layout.setLayoutParam(1, "align", { left: { target: 0, side: "right" }, middle: "parent" });
            layout.setLayoutParam(0, "margin", { left: screen.getPixelByDp(30) });
            layout.setLayoutParam(1, "margin", { left: screen.getPixelByDp(5) });
        }
        if (realHeight > ivSize) {
            layout.setLayoutParam(1, "margin", { top: screen.getPixelByDp(15) });
        }
        ret.height = realHeight > ivSize ? realHeight : ivSize;
        ret.width = realWidth + 60;
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
        // log.D(TAG , "bindData = " + position);
        // log.D(TAG , this.data[position]);
        if (this.data[position].WithUserName == "") return;
        let content_tv = convertView.findViewById("content");
        // content_tv.text = this.data[position].Content;
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
        } else {
            avatar_iv.src = resource.getImageSrc("images/em_default_avatar.png");
        }
    }

    buildLocationMsgLayout(position) {
        let ret = new CompositeView();
        let layout = new RelativeLayout();
        ret.layout = layout;
        var avatarIv = new ImageView();
        var ivSize = 40;
        avatarIv.id = "avatar";
        avatarIv.width = ivSize;
        avatarIv.height = ivSize;
        avatarIv.scaleType = ImageView.ScaleType.Fitxy;
        ret.addChild(avatarIv);

        let LOCATION_MSG_SIZE = 220;
        let contentView = new CompositeView();
        let contentLayout = new RelativeLayout();
        contentView.id = "content_view";
        contentView.layout = contentLayout;
        contentView.width = LOCATION_MSG_SIZE;
        contentView.height = LOCATION_MSG_SIZE;
        let bgIV = new ImageView();
        bgIV.id = "bg_id";
        bgIV.width = LOCATION_MSG_SIZE;
        bgIV.height = LOCATION_MSG_SIZE;
        let contextIv = new TextView();
        contextIv.id = "content";
        contextIv.width = LOCATION_MSG_SIZE;
        contextIv.height = 60;
        contextIv.background = "#D9D9D9";
        contextIv.fontSize = "10sp";
        contextIv.opacity = 0.6;
        contextIv.verticalAlign = TextView.VerticalAlign.Middle;
        contextIv.elideMode = TextView.ElideMode.ElideRight;
        contentView.addChild(bgIV);
        contentView.addChild(contextIv);
        contentLayout.setLayoutParam("content", "align", { bottom: "parent" });
        ret.addChild(contentView);

        if (!this.data[position].IsReceive) {
            layout.setLayoutParam("avatar", "align", { right: "parent" });
            layout.setLayoutParam("content_view", "align", { right: { target: "avatar", side: "left" } });
            layout.setLayoutParam("avatar", "margin", { right: screen.getPixelByDp(30) });
            layout.setLayoutParam("content_view", "margin", { right: screen.getPixelByDp(5) });
        } else {
            layout.setLayoutParam("avatar", "align", { left: "parent" });
            layout.setLayoutParam("content_view", "align", { left: { target: "avatar", side: "right" } });
            layout.setLayoutParam("avatar", "margin", { left: screen.getPixelByDp(30) });
            layout.setLayoutParam("content_view", "margin", { left: screen.getPixelByDp(5) });
        }
        ret.height = LOCATION_MSG_SIZE;
        ret.width = LOCATION_MSG_SIZE + 60;

        // BindData
        let _path = IMG_PATH + "_" + this.data[position].WithUserName + ".jpg";
        avatarIv.src = resource.getImageSrc("images/em_default_avatar.png");
        if (fs.existsSync(_path)) {
            imageLoader.displayImage(avatarIv, _path);
        } else if (this.mWxModule) {
            this.mWxModule.getHeadimg(this.data[position].WithUserName, (path) => {
                imageLoader.displayImage(avatarIv, path);
            });
        } else {
            avatarIv.src = resource.getImageSrc("images/em_default_avatar.png");
        }

        let _mapimg = IMG_PATH + "_" + this.data[position].MsgId + ".jpg";
        // bgIV.src = resource.getImageSrc("images/location_demo.png");
        if (fs.existsSync(_mapimg)) {
            imageLoader.displayImage(bgIV, _mapimg);
        } else if (this.mWxModule) {
            this.mWxModule.getImg(this.data[position].ImgUrl, this.data[position].MsgId, (path) => {
                imageLoader.displayImage(bgIV, path);
            });
        } else {
            bgIV.src = resource.getImageSrc("images/location_demo.png");
        }
        contextIv.text = this.data[position].Content;
        ret.Url = this.data[position].Url;
        log.D(TAG, "buildLocationMsgLayout Msg--------------");
        log.D(TAG, this.data[position]);
        return ret;
    }
}

module.exports = ChatAdapter;
