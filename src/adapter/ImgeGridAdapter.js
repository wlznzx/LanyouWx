const YObject = require("yunos/core/YObject");

const resource = require("yunos/content/resource/Resource").getInstance();
const GridView = require("yunos/ui/view/GridView");
const RelativeLayout = require("yunos/ui/layout/RelativeLayout");
const screen = require("yunos/device/Screen").getInstance();
const ImageView = require("yunos/ui/view/ImageView");

const BaseAdapter = require("yunos/ui/adapter/BaseAdapter");
const TAG = "grid";

class ImgeGridAdapter extends BaseAdapter {

    constructor(){
        super();
        // log.D(TAG,"grid start!!");
        // this.data = this.mockData();
    }

    createItem(index, v) {
        // log.D(TAG,"try createItem");
        let ItemData = this.data[index];
        // this.mockData();
        if (!v) {
            var v = new ImageView();
            v.scaleType = ImageView.ScaleType.Fitxy;
        }
        v.src = ItemData.image;
        let width = screen.widthPixels;
        log.D(TAG , width);
        v.width = width*3/(4*20);
        v.height = width*3/(4*20);
        return v;
    }

    mockData() {
        // log.D(TAG,"try mockData");
        var data = Array();
        var LEN = 100;
        for (let i = 0; i < LEN; i++) {
            var obj = {};
            let path = "/facev/smiley_" + i + ".png";
            obj.image = resource.getImageSrc(path);
            data[i] = obj;
        }
        // log.D(TAG,"had mockData");
        return data;
    }


}
module.exports = ImgeGridAdapter;
