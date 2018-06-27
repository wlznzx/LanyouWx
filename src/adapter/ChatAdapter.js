"use strict";

const BaseAdapter = require("yunos/ui/adapter/BaseAdapter");
const ListView = require("yunos/ui/view/ListView");
const ImageView = require("yunos/ui/view/ImageView");
const View = require("yunos/ui/view/View");
const CompositeView = require("yunos/ui/view/CompositeView");
const RelativeLayout = require("yunos/ui/layout/RelativeLayout");
const resource = require("yunos/content/resource/Resource").getInstance();
const TextView = require("yunos/ui/view/TextView");
const screen = require("yunos/device/Screen").getInstance();

class ChatAdapter extends BaseAdapter {
    createItem(position, convertView) {
        // log.I("TAG", "ChatAdapter position = " + position);
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

module.exports = ChatAdapter;
