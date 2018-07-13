const YObject = require("yunos/core/YObject");

const resource = require("yunos/content/resource/Resource").getInstance();
const GridView = require("yunos/ui/view/GridView");
const RelativeLayout = require("yunos/ui/layout/RelativeLayout");

const ImageView = require("yunos/ui/view/ImageView");
const TextView = require("yunos/ui/view/TextView");
const Button = require("yunos/ui/widget/Button");

const BaseAdapter = require("yunos/ui/adapter/BaseAdapter");
const TAG = "grid";

class TextGridAdapter extends BaseAdapter {

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
            var v = new Button();
            // v.scaleType = ImageView.ScaleType.Fitxy;
        }
        v.text = ItemData;
        v.sizeType = Button.SizeType.Small;
        v.width = 480 ;
        v.height = 48 ;
        v.borderWidth = 1;
        v.borderColor = "#c0c0c0";
        v.buttonColor = "rgba(123,127,141,0.4)";
        return v;
    }



}
module.exports = TextGridAdapter;
