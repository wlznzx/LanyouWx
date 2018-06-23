"use strict";

const Page = require("yunos/page/Page");
const BaseAdapter = require("yunos/ui/adapter/BaseAdapter");
const ListView = require("yunos/ui/view/ListView");
const ImageView = require("yunos/ui/view/ImageView");
const View = require("yunos/ui/view/View");
const CompositeView = require("yunos/ui/view/CompositeView");
const resource = require("yunos/content/resource/Resource").getInstance();
const screen = require("yunos/device/Screen").getInstance();
const RelativeLayout = require("yunos/ui/layout/RelativeLayout");
const TextView = require("yunos/ui/view/TextView");
const Color = require("yunos/graphics/Color");

class ChatPage extends Page {

    onStart() {
        this.initView();
        this.initDatas();
    }

    initView() {
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

    initDatas() {
        var data = [];
        for (let i = 0; i < 10; i++) {
            data[i] = "I am " + i;
        }
        var adapter = new MyAdapter();
        adapter.data = data;
        this.mContactLV.adapter = adapter;

        var data2 = [];
        for (let i = 0; i < 10; i++) {
            data2[i] = "I am " + i;
        }
        var chatAdapter = new ChatAdapter();
        chatAdapter.data = data2;
        this.mChatLV.adapter = chatAdapter;
    }
}

// var self = this;
class MyAdapter extends BaseAdapter {
    createItem(position, convertView) {
        if (!convertView) {
            convertView = new ListView.ListItem();
            convertView.type = ListView.ListItem.Type.DEFAULT;
            convertView.icon = resource.getImageSrc("images/icons/pf.jpg");
            convertView.title = "〆木雨";
            convertView.detail = "青春洋溢的少年.";
        }

        // if (isLastItem) {
        //     item.showShadow = true;
        // } else {
        //     item.showShadow = false;
        // }
        return convertView;
    }
}

class ChatAdapter extends BaseAdapter {
    createItem(position, convertView) {
        log.I("wltest", "ChatAdapter position = " + position);
        if (!convertView) {
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
        iv.scaleType = ImageView.ScaleType.Fitcenter;
        iv.id = "avatar";
        iv.width = ivSize - 5;
        iv.height = ivSize - 5;
        iv.src = resource.getImageSrc("images/icons/pf.jpg");

        ret.addChild(iv);
        let tv = new TextView();
        iv.id = "content";
        tv.fontSize = "14sp";
        tv.text = "Hello , 你好.";
        ret.addChild(tv);
        if (position === 3) {
            layout.setLayoutParam(0, "align", {right: "parent", top: "parent",middle: "parent"});
            layout.setLayoutParam(1, "align", {right: {target: 0, side: "left"},middle: "parent"});
            layout.setLayoutParam(0, "margin", {right: screen.getPixelByDp(30)});
            layout.setLayoutParam(1, "margin", {right: screen.getPixelByDp(15)});
            tv.text = "你好，我叫鹏飞。";
        } else {
            layout.setLayoutParam(0, "align", {left: "parent", top: "parent",middle: "parent"});
            layout.setLayoutParam(1, "align", {left: {target: 0, side: "right"},middle: "parent"});
            layout.setLayoutParam(0, "margin", {left: screen.getPixelByDp(30)});
            layout.setLayoutParam(1, "margin", {left: screen.getPixelByDp(15)});
        }
        ret.height = 60;
        ret.width = 200;
        // container.layout = ret;
        // var contentH = textZone.layout._contentHeight + 2 * this._style.paddingTop;
        // container.height = this.realHeight(this._style.defaultHeight, contentH);
        // this._icon = iv;
        // container.addChild(iv);
        // this.createItem(container, false);
        return ret;
    }
}

module.exports = ChatPage;
