"use strict";

const BaseAdapter = require("yunos/ui/adapter/BaseAdapter");
const ListView = require("yunos/ui/view/ListView");
const ImageView = require("yunos/ui/view/ImageView");
const View = require("yunos/ui/view/View");
const CompositeView = require("yunos/ui/view/CompositeView");
const resource = require("yunos/content/resource/Resource").getInstance();
const TextView = require("yunos/ui/view/TextView");
const screen = require("yunos/device/Screen").getInstance();

class ContactAdapter extends BaseAdapter {
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

module.exports = ContactAdapter;
