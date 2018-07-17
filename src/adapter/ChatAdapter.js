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
const SpriteView = require("yunos/ui/view/SpriteView");
const screen = require("yunos/device/Screen").getInstance();
var imageLoader = require("yunos/util/ImageLoader").getInstance();

const TAG = "WebWx_ChatAdapter";
const IMG_PATH = "/opt/data/share/LanyouWx.yunos.com/";
const WxFace = require("../WebWxModule/wx_face");
const RichTextView = require("yunos/ui/view/RichTextView");
const Image = require("yunos/multimedia/Image");


class ChatAdapter extends BaseAdapter {

    constructor(_module) {
        super();
        this.mWxModule = _module;
    }

    createItem(position, convertView) {
        if (this.data[position].MsgType == "3") {
            convertView = this.buildImgLayout(position);
        } else if (this.data[position].MsgType == "47") {
            if(this.data[position].Content == "表情."){
                convertView = this.buildImgLayout(position);
            }else{
                convertView = this.buildMsgLayout(position);
            }
        }else if (this.data[position].MsgType == "34") {
            convertView = this.buildVoiceMsgLayout(position);
        } else if (this.data[position].MsgType == "49") {
            convertView = this.buildLinkMsgLayout(position);
        }else if (this.data[position].Url) {
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

        // let wxFace = new WxFace(this.data[position].Content);
        //
        //
        // if(wxFace.isFace){
        //     let face = wxFace.faceVIew;
        //     ret.addChild(face);
        //     if (!this.data[position].IsReceive) {
        //         layout.setLayoutParam(0, "align", {right: "parent",middle: "parent"});
        //         layout.setLayoutParam(1, "align", {right: {target: 0, side: "left"},middle: "parent"});
        //         layout.setLayoutParam(0, "margin", {right: screen.getPixelByDp(30)});
        //         layout.setLayoutParam(1, "margin", {right: screen.getPixelByDp(5)});
        //         ret.height = 400;
        //     }else {
        //         ret.height = 60;
        //         layout.setLayoutParam(0, "align", {left: "parent",middle: "parent"});
        //         layout.setLayoutParam(1, "align", {left: {target: 0, side: "right"},middle: "parent"});
        //         layout.setLayoutParam(0, "margin", {left: screen.getPixelByDp(30)});
        //         layout.setLayoutParam(1, "margin", {left: screen.getPixelByDp(5)});
        //     }
        //     ret.height = 60;
        //     ret.width = 400;
        //
        //     this.bindFaceData(ret, position);
        //     return ret;
        //
        // }else{

        let tv = new RichTextView();
        // let tv = new TextView();

        // let facePath = resource.getImageSrc("/images/qqface.png");
        // let faceImage = new Image(facePath);
        // let height_face = faceImage.height/7;


        tv.id = "content";
        tv.fontSize = "12sp";
        tv.fontWeight = TextView.FontWeight.Light;
        tv.verticalAlign = TextView.VerticalAlign.Middle;
        tv.maxWidth = 350;
        tv.multiLine = true;

        if (this.data[position].Content) {
          // tv.capInsets = [10, 10, 20, 2];
          // tv.capInsets = [10, 10, 20, 2];
          tv.text = this.data[position].Content;
          // tv.background = resource.getImageSrc("images/chat_rev_bg.9.png");
        }
        let realWidth = tv.contentWidth;
        let realHeight = tv.contentHeight;


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
        // }
    }

    bindData(convertView, position) {
        // log.D(TAG , "bindData = " + position);
        // log.D(TAG , this.data[position]);
        if(this.data[position].WithUserName == "") return;

        let content_tv = convertView.findViewById("content");
        let content = this.data[position].Content;



        let pattern_face= /\[.*?\]/g;
        let array_face = content.match(pattern_face);

        let index = 0;
        let str = "";


        if(array_face != null){
            for(let i=0 ;i < array_face.length;i++){
                //richTextView.text = "This is a <b>very<img src=\"" + smileFace2 + "\" width=\"65\" height=\"65\" align=\"middle\"/>happy</b> face vertically aligned in the middle.";
                // log.D("test","进行第" + i + "次");

                let wxFace = new WxFace(array_face[i]);
                if(wxFace.isFace){
                    let path = "/facev/" + "smiley_" + wxFace.index +".png";

                    let src = resource.getImageSrc(path);



                    str += content.slice(index,content.indexOf(array_face[i], index));
                    str += "<img src=\"" + src +"\"  width=\"30\" height=\"30\" align=\"middle\"/>";

                }else{
                    str += content.slice(index , content.indexOf(array_face[i] , index) + array_face[i].length);
                }

                index = content.indexOf(array_face[i] , index) + array_face[i].length;

                log.D("test" , "index:" + index);
                log.D("test" ,"str:" + str);
            }
            str += content.slice(index);
        }
        else{
            str = content;
        }
        log.D("--------------");
        log.D("test" ,"final str:" + str);

        content_tv.text = str;

        let avatar_iv = convertView.findViewById("avatar");
        if (!this.data[position].IsReceive) {
            this.data[position].WithUserName = this.mWxModule.my.UserName;
        }
        let _path = IMG_PATH + "_" + this.data[position].WithUserName + ".jpg";
        if (fs.existsSync(_path)) {
            // log.D("test" , "do re_path = " + _path);
            imageLoader.displayImage(avatar_iv, _path);
        } else if (this.mWxModule) {
            // log.D("test","网上拉取");
            this.mWxModule.getHeadimg(this.data[position].WithUserName, (path) => {
                imageLoader.displayImage(avatar_iv, path);
            });
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
            this.data[position].WithUserName = this.mWxModule.my.UserName;
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
            this.mWxModule.getLocationImg(this.data[position].MsgId, (path) => {
                imageLoader.displayImage(bgIV, path);
            });
        } else {
            bgIV.src = resource.getImageSrc("images/location_demo.png");
        }
        contextIv.text = this.data[position].Content;
        ret.Url = this.data[position].Url;

        ret.MsgType = this.data[position].MsgType;
        log.D(TAG, "buildLocationMsgLayout Msg--------------");
        log.D(TAG, this.data[position]);
        return ret;
    }

    buildVoiceMsgLayout(position) {
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

        const animationView = new SpriteView();
        animationView.id = "anim_view";
        // 指定控件大小
        animationView.width = 25;
        animationView.height = 25;
        // 设置控件Sprite图片
        // animationView.src = resource.getImageSrc("./images/voice.png");
        // 设置每帧展示的图片大小
        animationView.frameWidth = 25;
        animationView.frameHeight = 25;
        // 设置单帧持续时间，单位是ms
        animationView.frameDuration = 150;
        // 设置执行总帧数
        animationView.frameCount = 3;

        let Lmin = 50;
        let Lmax = 300;
        let barLen = 0;
        let barCanChangeLen = Lmax - Lmin;
        let VoicePlayTimes = this.data[position].VoiceLength / 1000;
        if (VoicePlayTimes < 11) {
            barLen = Lmin + VoicePlayTimes * 0.05 * barCanChangeLen; // VoicePlayTimes 为10秒时，正好为可变长度的一半
        } else {
            barLen = Lmin + 0.5 * barCanChangeLen + (VoicePlayTimes - 10) * 0.01 * barCanChangeLen;
        }

        log.D(TAG, "barLen = " + barLen);

        let bgView = new View();
        bgView.id = "bg_view";
        bgView.width = Math.floor(barLen);
        bgView.height = ivSize;
        // bgView.background = "white";
        bgView.borderColor = "black"; // 设置边框颜色为蓝色
        bgView.borderWidth = 1; // 设置边框宽度为4像素；
        bgView.borderRadius = 5; // 设置边框为半径为20像素的圆角矩形；
        bgView.opacity = 1; // 设置 View 的透明度；


        let voiceLenghtTv = new TextView();
        voiceLenghtTv.id = "voice_lenght_tv";
        voiceLenghtTv.width = 20;
        voiceLenghtTv.height = 15;
        voiceLenghtTv.fontSize = "10sp";
        voiceLenghtTv.Color = "gray";
        voiceLenghtTv.text = VoicePlayTimes + "''";

        ret.addChild(bgView);
        ret.addChild(animationView);
        ret.addChild(voiceLenghtTv);


        if (!this.data[position].IsReceive) {
            layout.setLayoutParam("avatar", "align", { right: "parent" });
            layout.setLayoutParam("anim_view", "align", { right: { target: "avatar", side: "left" }, middle: "parent" });
            layout.setLayoutParam("bg_view", "align", { right: { target: "avatar", side: "left" }, middle: "parent" });
            layout.setLayoutParam("voice_lenght_tv", "align", { right: { target: "bg_view", side: "left" }, middle: "parent" });
            layout.setLayoutParam("avatar", "margin", { right: screen.getPixelByDp(30) });
            layout.setLayoutParam("anim_view", "margin", { right: screen.getPixelByDp(30) });
            layout.setLayoutParam("bg_view", "margin", { right: screen.getPixelByDp(15) });
            layout.setLayoutParam("voice_lenght_tv", "margin", { right: screen.getPixelByDp(30) });
            bgView.background = "#b2e281";
            this.data[position].WithUserName = this.mWxModule.my.UserName;
            animationView.src = resource.getImageSrc("./images/voice_self.png");
        } else {
            layout.setLayoutParam("avatar", "align", { left: "parent" });
            layout.setLayoutParam("anim_view", "align", { left: { target: "avatar", side: "right" }, middle: "parent" });
            layout.setLayoutParam("bg_view", "align", { left: { target: "avatar", side: "right" }, middle: "parent" });
            layout.setLayoutParam("voice_lenght_tv", "align", { left: { target: "bg_view", side: "right" }, middle: "parent" });
            layout.setLayoutParam("avatar", "margin", { left: screen.getPixelByDp(30) });
            layout.setLayoutParam("anim_view", "margin", { left: screen.getPixelByDp(30) });
            layout.setLayoutParam("bg_view", "margin", { left: screen.getPixelByDp(15) });
            layout.setLayoutParam("voice_lenght_tv", "margin", { left: screen.getPixelByDp(10) });
            animationView.src = resource.getImageSrc("./images/voice.png");
            bgView.background = "white";
        }

        ret.height = ivSize;
        ret.width = bgView.width + 60;

        let _path = IMG_PATH + "_" + this.data[position].WithUserName + ".jpg";
        if (fs.existsSync(_path)) {
            imageLoader.displayImage(avatarIv, _path);
        } else if (this.mWxModule) {
            this.mWxModule.getHeadimg(this.data[position].WithUserName, (path) => {
                imageLoader.displayImage(avatarIv, path);
            });
        } else {
            avatarIv.src = resource.getImageSrc("images/em_default_avatar.png");
        }

        let msgInfo = new Object();
        msgInfo.MsgId = this.data[position].MsgId;
        msgInfo.VoiceLength = this.data[position].VoiceLength
        ret.animationView = animationView;
        ret.msgInfo = msgInfo;
        ret.MsgType = this.data[position].MsgType;

        if(this.playingMsgId == msgInfo.MsgId){
            animationView.start();
        }
        return ret;
    }

    buildImgLayout(position) {
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

        let IMG_MSG_WIDTH = 350;
        let IMG_MSG_HEIGHT = 250;
        let bgIV = new ImageView();
        bgIV.id = "bg_id";

        // bgIV.height = IMG_MSG_HEIGHT;
        bgIV.scaleType = ImageView.ScaleType.Fitxy;


        if (!this.data[position].IsReceive) {
            layout.setLayoutParam("avatar", "align", { right: "parent" });
            layout.setLayoutParam("bg_id", "align", { right: { target: "avatar", side: "left" } });
            layout.setLayoutParam("avatar", "margin", { right: screen.getPixelByDp(30) });
            layout.setLayoutParam("bg_id", "margin", { right: screen.getPixelByDp(5) });
            this.data[position].WithUserName = this.mWxModule.my.UserName;
        } else {
            layout.setLayoutParam("avatar", "align", { left: "parent" });
            layout.setLayoutParam("bg_id", "align", { left: { target: "avatar", side: "right" } });
            layout.setLayoutParam("avatar", "margin", { left: screen.getPixelByDp(30) });
            layout.setLayoutParam("bg_id", "margin", { left: screen.getPixelByDp(5) });
        }
        ret.height = 350;
        ret.width = 350 + 60;

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

        let _img = IMG_PATH + "_" + this.data[position].MsgId + ".jpg";
        // bgIV.src = resource.getImageSrc("images/location_demo.png");
        if (fs.existsSync(_img)) {
            imageLoader.load(_img, (err, bitmap) => {
                if(!err){
                    let width = bitmap.width;
                    let height = bitmap.height;
                    let i = height/width;
                    if(width >= height){
                        if(width > IMG_MSG_WIDTH){
                            height = IMG_MSG_WIDTH*i;
                            width = IMG_MSG_WIDTH;
                        }
                    }else{
                        if(height > IMG_MSG_WIDTH){
                            width = IMG_MSG_WIDTH/i;
                            height =IMG_MSG_WIDTH
                        }
                    }
                    bgIV.width = width;
                    bgIV.height = height;
                    bgIV.src = bitmap;
                    ret.height = height > ivSize ? height : ivSize;
                    ret.width = width + 60;

                }
            });
            // imageLoader.displayImage(bgIV, _img);
        } else if (this.mWxModule) {
            this.mWxModule.getMsgImg(this.data[position].MsgId, (path) => {
                imageLoader.load(path, (err, bitmap) => {
                    if(!err){
                        let width = bitmap.width;
                        let height = bitmap.height;
                        let i = height/width;

                        if(width >= height){
                            if(width > IMG_MSG_WIDTH){
                                height = IMG_MSG_WIDTH*i;
                                width = IMG_MSG_WIDTH;
                            }
                        }else{
                            if(height > IMG_MSG_WIDTH){
                                width = IMG_MSG_WIDTH/i;
                                height =IMG_MSG_WIDTH
                            }
                        }
                        bgIV.width = width;
                        bgIV.height = height;
                        bgIV.src = bitmap;
                        ret.height = height > ivSize ? height : ivSize;
                        ret.width = width + 60;
                    }
                });
                // imageLoader.displayImage(bgIV, path);
            });
        } else {
            bgIV.src = resource.getImageSrc("images/location_demo.png");
        }
        ret.Url = this.data[position].Url;
        ret.MsgType = this.data[position].MsgType;
        ret.addChild(bgIV);
        // log.D(TAG, "buildLocationMsgLayout Msg--------------");
        // log.D(TAG, this.data[position]);
        return ret;
    }


    buildLinkMsgLayout(position){
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

        //具体内容分三部分，标题，正文和图片
        let linkTV = new CompositeView();
        let linkLayout = new RelativeLayout();
        linkTV.layout = linkLayout;
        linkTV.id = "linkTV";

        let title_tv = new TextView();
        title_tv.id = "title_tv";
        title_tv.fontWeight = TextView.FontWeight.Bold;
        title_tv.fontSize = "11sp";
        title_tv.maxWidth = 350;
        title_tv.multiLine = true;


        let content_tv = new TextView();
        content_tv.id = "content_tv";
        content_tv.fontSize = "9sp";
        content_tv.maxWidth = 260;
        content_tv.multiLine = true;

        let bg_tv = new ImageView();
        bg_tv.id = "bg_tv";
        bg_tv.scaleType = ImageView.ScaleType.Fitxy;
        bg_tv.height = 60;
        bg_tv.width = 90;

        linkTV.addChild(title_tv);
        linkTV.addChild(content_tv);
        linkTV.addChild(bg_tv);

        linkLayout.setLayoutParam("title_tv", "align", { top: "parent" });
        linkLayout.setLayoutParam("content_tv", "align", { left: { target:"title_tv", side: "left"} ,top: { target:"title_tv", side: "bottom"} });
        linkLayout.setLayoutParam("bg_tv", "align", { left: { target:"content_tv", side: "right"},top: { target:"content_tv", side: "top"} });
        linkLayout.setLayoutParam("content_tv", "margin", { top: screen.getPixelByDp(5) });
        linkLayout.setLayoutParam("bg_tv", "margin", { left: screen.getPixelByDp(5) });

        ret.addChild(linkTV);
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
        // if (realHeight > ivSize) {
        //     layout.setLayoutParam(1, "margin", { top: screen.getPixelByDp(15) });
        // }
        layout.setLayoutParam(1, "margin", { top: screen.getPixelByDp(15) });

        this.bindLinkData(ret, position);
        return ret;

    }

    bindLinkData(convertView, position) {
        // log.D(TAG , "bindData = " + position);
        // log.D(TAG , this.data[position]);
        if(this.data[position].WithUserName == "") return;

        let linkTV = convertView.findViewById("linkTV");
        let bg_tv = linkTV.findViewById("bg_tv");
        let title_tv = linkTV.findViewById("title_tv");
        let content_tv = linkTV.findViewById("content_tv");

        let content = this.data[position].Content;
        log.D(TAG , content);

        let pattern_title= /(?<=title&gt;).*?(?=&lt;)/;
        let array_title = content.match(pattern_title);
        log.D(TAG , "array_title:  " + array_title);
        //避免网络问题，分享点击过快数据未加载时，显示空白（网页版微信也是一样的）。
        if(array_title != null){
            title_tv.text = array_title[0];
        }else {
            title_tv.text = "  ";
        }

        let pattern_content= /(?<=des&gt;).*?(?=&lt;)/;
        let array_content = content.match(pattern_content);
        log.D(TAG , "array_content:  " + array_content);
        if(array_content != null){
            content_tv.text = array_content[0] + "..";
        }else{
            content_tv.text = "   ";
        }



        let _pathLink = IMG_PATH + "_" + this.data[position].MsgId + ".jpg";
        if (fs.existsSync(_pathLink)) {
            imageLoader.displayImage(bg_tv, _pathLink);
        } else if (this.mWxModule) {
            this.mWxModule.getLinkMsgImg(this.data[position].MsgId, (path) => {
                log.D(TAG , "pathLink: " + path);
                log.D(TAG , "MsgId: " + this.data[position].MsgId);
                imageLoader.displayImage(bg_tv, path);
            });
        }

        // linkTV.height = title_tv.height + content_tv.height;
        linkTV.height = content_tv.height > bg_tv.height ? content_tv.height + title_tv.height + screen.getPixelByDp(5) : bg_tv.height + title_tv.height + screen.getPixelByDp(5);
        linkTV.width = 350;
        convertView.height = linkTV.height;
        convertView.width = linkTV.width + 60;
        convertView.Url = this.data[position].Url;

        let avatar_iv = convertView.findViewById("avatar");
        if (!this.data[position].IsReceive) {
            this.data[position].WithUserName = this.mWxModule.my.UserName;
        }
        let _path = IMG_PATH + "_" + this.data[position].WithUserName + ".jpg";
        if (fs.existsSync(_path)) {
            imageLoader.displayImage(avatar_iv, _path);
        } else if (this.mWxModule) {
            this.mWxModule.getHeadimg(this.data[position].WithUserName, (path) => {
                log.D(TAG , "path: " + path);
                imageLoader.displayImage(avatar_iv, path);
            });
        }
    }

}

module.exports = ChatAdapter;
