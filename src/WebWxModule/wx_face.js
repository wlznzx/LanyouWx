"use strict"
const ImageView = require("yunos/ui/view/ImageView");
const Bitmap = require("yunos/graphics/Bitmap");
const Image = require("yunos/multimedia/Image");
const resource = require("yunos/content/resource/Resource").getInstance();
let path = resource.getImageSrc("/images/qqface1.png");

class WxFace{
    constructor(){

        this.image = new Image(path);

        //设置单个表情的大小
        this.width = this.image.width/15;
        this.height = this.image.height/7;
        this.isFace = false;

        if(arguments.length == 1){
            this.msg = arguments[0];
            this.onlyJudgeXY(this.msg);
        }else if(arguments.length == 2){
            let x = arguments[0];
            let y = arguments[1];
            if(typeof x == "number"&&typeof y == "number"){
                this.msg = this.getFaceMsg(x,y);
                //当参数为两个时，不进行是否是表情的判断，因为X,Y的范围在main.js中由图片适配，不会出现问题。
                this.isFace = true;
            }else {
                this.isFace = false;
            }
        }else{
            //未抛出异常
            log.E("test","argument.length is wrong!");
            this.isFace = false;
        }

        this.index = this.getIndex();
        // this.faceVIew = this.getFaceVIew();

        log.D("test",this.width);
    }

    //判断该表情所在位置，并返回对应msg；
    getFaceMsg(x,y){
        if(y <= this.height){
            if(x <= this.width){
                this.image_x = 0;
                this.image_y = 0;
                return "[微笑]";
            }else if (x <= this.width*2) {
                this.image_x = this.width;
                this.image_y = 0;
                return "[撇嘴]";
            }else if (x <= this.width*3){
                this.image_x = this.width*2;
                this.image_y = 0;
                return "[色]";
            }else if (x <= this.width*4){
                this.image_x = this.width*3;
                this.image_y = 0;
                return "[发呆]";
            }else if (x <= this.width*5){
                this.image_x = this.width*4;
                this.image_y = 0;
                return "[得意]";
            }else if (x <= this.width*6){
                this.image_x = this.width*5;
                this.image_y = 0;
                return "[流泪]";
            }else if (x <= this.width*7){
                this.image_x = this.width*6;
                this.image_y = 0;
                return "[害羞]";
            }else if (x <= this.width*8){
                this.image_x = this.width*7;
                this.image_y = 0;
                return "[闭嘴]";
            }else if (x <= this.width*9){
                this.image_x = this.width*8;
                this.image_y = 0;
                return "[睡]";
            }else if (x <= this.width*10){
                this.image_x = this.width*9;
                this.image_y = 0;
                return "[大哭]";
            }else if (x <= this.width*11){
                this.image_x = this.width*10;
                this.image_y = 0;
                return "[尴尬]";
            }else if (x <= this.width*12){
                this.image_x = this.width*11;
                this.image_y = 0;
                return "[发怒]";
            }else if (x <= this.width*13){
                this.image_x = this.width*12;
                this.image_y = 0;
                return "[调皮]";
            }else if (x <= this.width*14){
                this.image_x = this.width*13;
                this.image_y = 0;
                return "[呲牙]";
            }else if (x <= this.width*15){
                this.image_x = this.width*14;
                this.image_y = 0;
                return "[惊讶]";
            }
        }else if (y <= this.height*2){
            if(x <= this.width){
                this.image_x = 0;
                this.image_y = this.height;
                return "[难过]";
            }else if (x <= this.width*2) {
                this.image_x = this.width;
                this.image_y = this.height;
                return "[酷]";
            }else if (x <= this.width*3){
                this.image_x = this.width*2;
                this.image_y = this.height;
                return "[冷汗]";
            }else if (x <= this.width*4){
                this.image_x = this.width*3;
                this.image_y = this.height;
                return "[抓狂]";
            }else if (x <= this.width*5){
                this.image_x = this.width*4;
                this.image_y = this.height;
                return "[吐]";
            }else if (x <= this.width*6){
                this.image_x = this.width*5;
                this.image_y = this.height;
                return "[偷笑]";
            }else if (x <= this.width*7){
                this.image_x = this.width*6;
                this.image_y = this.height;
                return "[愉快]";
            }else if (x <= this.width*8){
                this.image_x = this.width*7;
                this.image_y = this.height;
                return "[白眼]";
            }else if (x <= this.width*9){
                this.image_x = this.width*8;
                this.image_y = this.height;
                return "[傲慢]";
            }else if (x <= this.width*10){
                this.image_x = this.width*9;
                this.image_y = this.height;
                return "[饥饿]";
            }else if (x <= this.width*11){
                this.image_x = this.width*10;
                this.image_y = this.height;
                return "[困]";
            }else if (x <= this.width*12){
                this.image_x = this.width*11;
                this.image_y = this.height;
                return "[惊恐]";
            }else if (x <= this.width*13){
                this.image_x = this.width*12;
                this.image_y = this.height;
                return "[流汗]";
            }else if (x <= this.width*14){
                this.image_x = this.width*13;
                this.image_y = this.height;
                return "[憨笑]";
            }else if (x <= this.width*15){
                this.image_x = this.width*14;
                this.image_y = this.height;
                return "[悠闲]";
            }
        }else if(y <= this.height*3){
            if(x <= this.width){
                this.image_x = 0;
                this.image_y = this.height*2;
                return "[奋斗]";
            }else if (x <= this.width*2) {
                this.image_x = this.width;
                this.image_y = this.height*2;
                return "[咒骂]";
            }else if (x <= this.width*3){
                this.image_x = this.width*2;
                this.image_y = this.height*2;
                return "[疑问]";
            }else if (x <= this.width*4){
                this.image_x = this.width*3;
                this.image_y = this.height*2;
                return "[嘘]";
            }else if (x <= this.width*5){
                this.image_x = this.width*4;
                this.image_y = this.height*2;
                return "[晕]";
            }else if (x <= this.width*6){
                this.image_x = this.width*5;
                this.image_y = this.height*2;
                return "[疯了]";
            }else if (x <= this.width*7){
                this.image_x = this.width*6;
                this.image_y = this.height*2;
                return "[衰]";
            }else if (x <= this.width*8){
                this.image_x = this.width*7;
                this.image_y = this.height*2;
                return "[骷髅]";
            }else if (x <= this.width*9){
                this.image_x = this.width*8;
                this.image_y = this.height*2;
                return "[敲打]";
            }else if (x <= this.width*10){
                this.image_x = this.width*9;
                this.image_y = this.height*2;
                return "[再见]";
            }else if (x <= this.width*11){
                this.image_x = this.width*10;
                this.image_y = this.height*2;
                return "[擦汗]";
            }else if (x <= this.width*12){
                this.image_x = this.width*11;
                this.image_y = this.height*2;
                return "[抠鼻]";
            }else if (x <= this.width*13){
                this.image_x = this.width*12;
                this.image_y = this.height*2;
                return "[鼓掌]";
            }else if (x <= this.width*14){
                this.image_x = this.width*13;
                this.image_y = this.height*2;
                return "[糗大了]";
            }else if (x <= this.width*15){
                this.image_x = this.width*14;
                this.image_y = this.height*2;
                return "[坏笑]";
            }
        }else if(y <= this.height*4){
            if(x <= this.width){
                this.image_x = 0;
                this.image_y = this.height*3;
                return "[左哼哼]";
            }else if (x <= this.width*2) {
                this.image_x = this.width;
                this.image_y = this.height*3;
                return "[右哼哼]";
            }else if (x <= this.width*3){
                this.image_x = this.width*2;
                this.image_y = this.height*3;
                return "[哈欠]";
            }else if (x <= this.width*4){
                this.image_x = this.width*3;
                this.image_y = this.height*3;
                return "[鄙视]";
            }else if (x <= this.width*5){
                this.image_x = this.width*4;
                this.image_y = this.height*3;
                return "[委屈]";
            }else if (x <= this.width*6){
                this.image_x = this.width*5;
                this.image_y = this.height*3;
                return "[快哭了]";
            }else if (x <= this.width*7){
                this.image_x = this.width*6;
                this.image_y = this.height*3;
                return "[阴险]";
            }else if (x <= this.width*8){
                this.image_x = this.width*7;
                this.image_y = this.height*3;
                return "[亲亲]";
            }else if (x <= this.width*9){
                this.image_x = this.width*8;
                this.image_y = this.height*3;
                return "[吓]";
            }else if (x <= this.width*10){
                this.image_x = this.width*9;
                this.image_y = this.height*3;
                return "[可怜]";
            }else if (x <= this.width*11){
                this.image_x = this.width*10;
                this.image_y = this.height*3;
                return "[菜刀]";
            }else if (x <= this.width*12){
                this.image_x = this.width*11;
                this.image_y = this.height*3;
                return "[西瓜]";
            }else if (x <= this.width*13){
                this.image_x = this.width*12;
                this.image_y = this.height*3;
                return "[啤酒]";
            }else if (x <= this.width*14){
                this.image_x = this.width*13;
                this.image_y = this.height*3;
                return "[篮球]";
            }else if (x <= this.width*15){
                this.image_x = this.width*14;
                this.image_y = this.height*3;
                return "[乒乓]";
            }
        }else if(y <= this.height*5){
            if(x <= this.width){
                this.image_x = 0;
                this.image_y = this.height*4;
                return "[咖啡]";
            }else if (x <= this.width*2) {
                this.image_x = this.width;
                this.image_y = this.height*4;
                return "[饭]";
            }else if (x <= this.width*3){
                this.image_x = this.width*2;
                this.image_y = this.height*4;
                return "[猪头]";
            }else if (x <= this.width*4){
                this.image_x = this.width*3;
                this.image_y = this.height*4;
                return "[玫瑰]";
            }else if (x <= this.width*5){
                this.image_x = this.width*4;
                this.image_y = this.height*4;
                return "[凋谢]";
            }else if (x <= this.width*6){
                this.image_x = this.width*5;
                this.image_y = this.height*4;
                return "[嘴唇]";
            }else if (x <= this.width*7){
                this.image_x = this.width*6;
                this.image_y = this.height*4;
                return "[爱心]";
            }else if (x <= this.width*8){
                this.image_x = this.width*7;
                this.image_y = this.height*4;
                return "[心碎]";
            }else if (x <= this.width*9){
                this.image_x = this.width*8;
                this.image_y = this.height*4;
                return "[蛋糕]";
            }else if (x <= this.width*10){
                this.image_x = this.width*9;
                this.image_y = this.height*4;
                return "[闪电]";
            }else if (x <= this.width*11){
                this.image_x = this.width*10;
                this.image_y = this.height*4;
                return "[炸弹]";
            }else if (x <= this.width*12){
                this.image_x = this.width*11;
                this.image_y = this.height*4;
                return "[刀]";
            }else if (x <= this.width*13){
                this.image_x = this.width*12;
                this.image_y = this.height*4;
                return "[足球]";
            }else if (x <= this.width*14){
                this.image_x = this.width*13;
                this.image_y = this.height*4;
                return "[瓢虫]";
            }else if (x <= this.width*15){
                this.image_x = this.width*14;
                this.image_y = this.height*4;
                return "[便便]";
            }
        }else if(y <= this.height*6){
            if(x <= this.width){
                this.image_x = 0;
                this.image_y = this.height*5;
                return "[月亮]";
            }else if (x <= this.width*2) {
                this.image_x = this.width;
                this.image_y = this.height*5;
                return "[太阳]";
            }else if (x <= this.width*3){
                this.image_x = this.width*2;
                this.image_y = this.height*5;
                return "[礼物]";
            }else if (x <= this.width*4){
                this.image_x = this.width*3;
                this.image_y = this.height*5;
                return "[拥抱]";
            }else if (x <= this.width*5){
                this.image_x = this.width*4;
                this.image_y = this.height*5;
                return "[强]";
            }else if (x <= this.width*6){
                this.image_x = this.width*5;
                this.image_y = this.height*5;
                return "[弱]";
            }else if (x <= this.width*7){
                this.image_x = this.width*6;
                this.image_y = this.height*5;
                return "[握手]";
            }else if (x <= this.width*8){
                this.image_x = this.width*7;
                this.image_y = this.height*5;
                return "[胜利]";
            }else if (x <= this.width*9){
                this.image_x = this.width*8;
                this.image_y = this.height*5;
                return "[抱拳]";
            }else if (x <= this.width*10){
                this.image_x = this.width*9;
                this.image_y = this.height*5;
                return "[勾引]";
            }else if (x <= this.width*11){
                this.image_x = this.width*10;
                this.image_y = this.height*5;
                return "[拳头]";
            }else if (x <= this.width*12){
                this.image_x = this.width*11;
                this.image_y = this.height*5;
                return "[差劲]";
            }else if (x <= this.width*13){
                this.image_x = this.width*12;
                this.image_y = this.height*5;
                return "[爱你]";
            }else if (x <= this.width*14){
                this.image_x = this.width*13;
                this.image_y = this.height*5;
                return "[NO]";
            }else if (x <= this.width*15){
                this.image_x = this.width*14;
                this.image_y = this.height*5;
                return "[OK]";
            }
        }else if(y <= this.height*7){
            if(x <= this.width){
                this.image_x = 0;
                this.image_y = this.height*6;
                return "[爱情]";
            }else if (x <= this.width*2) {
                this.image_x = this.width;
                this.image_y = this.height*6;
                return "[飞吻]";
            }else if (x <= this.width*3){
                this.image_x = this.width*2;
                this.image_y = this.height*6;
                return "[跳跳]";
            }else if (x <= this.width*4){
                this.image_x = this.width*3;
                this.image_y = this.height*6;
                return "[发抖]";
            }else if (x <= this.width*5){
                this.image_x = this.width*4;
                this.image_y = this.height*6;
                return "[怄火]";
            }else if (x <= this.width*6){
                this.image_x = this.width*5;
                this.image_y = this.height*6;
                return "[转圈]";
            }else if (x <= this.width*7){
                this.image_x = this.width*6;
                this.image_y = this.height*6;
                return "[磕头]";
            }else if (x <= this.width*8){
                this.image_x = this.width*7;
                this.image_y = this.height*6;
                return "[回头]";
            }else if (x <= this.width*9){
                this.image_x = this.width*8;
                this.image_y = this.height*6;
                return "[跳绳]";
            }else if (x <= this.width*10){
                this.image_x = this.width*9;
                this.image_y = this.height*6;
                return "[投降]";
            }else if (x <= this.width*11){
                this.image_x = this.width*10;
                this.image_y = this.height*6;
                return "[激动]";
            }else if (x <= this.width*12){
                this.image_x = this.width*11;
                this.image_y = this.height*6;
                return "[乱舞]";
            }else if (x <= this.width*13){
                this.image_x = this.width*12;
                this.image_y = this.height*6;
                return "[献吻]";
            }else if (x <= this.width*14){
                this.image_x = this.width*13;
                this.image_y = this.height*6;
                return "[左太极]";
            }else if (x <= this.width*15){
                this.image_x = this.width*14;
                this.image_y = this.height*6;
                return "[右太极]";
            }
        }
    }

    onlyJudgeXY(msg){
        if(typeof(msg) !== "string"){
            log.E("test","msg is not string!!");
            this.isFace = false;
            //未抛出异常
        }else{
            switch(msg){
                case "[微笑]":
                this.image_x = 0;
                this.image_y = 0;
                this.isFace = true;
                break;
                case "[撇嘴]":
                this.image_x = this.width;
                this.image_y = 0;
                this.isFace = true;
                break;
                case "[色]":
                this.image_x = this.width*2;
                this.image_y = 0;
                this.isFace = true;
                break;
                case "[发呆]":
                this.image_x = this.width*3;
                this.image_y = 0;
                this.isFace = true;
                break;
                case "[得意]":
                this.image_x = this.width*4;
                this.image_y = 0;
                this.isFace = true;
                break;
                case "[流泪]":
                this.image_x = this.width*5;
                this.image_y = 0;
                this.isFace = true;
                break;
                case "[害羞]":
                this.image_x = this.width*6;
                this.image_y = 0;
                this.isFace = true;
                break;
                case "[闭嘴]":
                this.image_x = this.width*7;
                this.image_y = 0;
                this.isFace = true;
                break;
                case "[睡]":
                this.image_x = this.width*8;
                this.image_y = 0;
                this.isFace = true;
                break;
                case "[大哭]":
                this.image_x = this.width*9;
                this.image_y = 0;
                this.isFace = true;
                break;
                case "[尴尬]":
                this.image_x = this.width*10;
                this.image_y = 0;
                this.isFace = true;
                break;
                case "[发怒]":
                this.image_x = this.width*11;
                this.image_y = 0;
                this.isFace = true;
                break;
                case "[调皮]":
                this.image_x = this.width*12;
                this.image_y = 0;
                this.isFace = true;
                break;
                case "[呲牙]":
                this.image_x = this.width*13;
                this.image_y = 0;
                this.isFace = true;
                break;
                case "[惊讶]":
                this.image_x = this.width*14;
                this.image_y = 0;
                this.isFace = true;
                break;
                case "[难过]":
                this.image_x = 0;
                this.image_y = this.height;
                this.isFace = true;
                break;
                case "[酷]":
                this.image_x = this.width;
                this.image_y = this.height;
                this.isFace = true;
                break;
                case "[冷汗]":
                this.image_x = this.width*2;
                this.image_y = this.height;
                this.isFace = true;
                break;
                case "[抓狂]":
                this.image_x = this.width*3;
                this.image_y = this.height;
                this.isFace = true;
                break;
                case "[吐]":
                this.image_x = this.width*4;
                this.image_y = this.height;
                this.isFace = true;
                break;
                case "[偷笑]":
                this.image_x = this.width*5;
                this.image_y = this.height;
                this.isFace = true;
                break;
                case "[愉快]":
                this.image_x = this.width*6;
                this.image_y = this.height;
                this.isFace = true;
                break;
                case "[白眼]":
                this.image_x = this.width*7;
                this.image_y = this.height;
                this.isFace = true;
                break;
                case "[傲慢]":
                this.image_x = this.width*8;
                this.image_y = this.height;
                this.isFace = true;
                break;
                case "[饥饿]":
                this.image_x = this.width*9;
                this.image_y = this.height;
                this.isFace = true;
                break;
                case "[困]":
                this.image_x = this.width*10;
                this.image_y = this.height;
                this.isFace = true;
                break;
                case "[惊恐]":
                this.image_x = this.width*11;
                this.image_y = this.height;
                this.isFace = true;
                break;
                case "[流汗]":
                this.image_x = this.width*12;
                this.image_y = this.height;
                this.isFace = true;
                break;
                case "[憨笑]":
                this.image_x = this.width*13;
                this.image_y = this.height;
                this.isFace = true;
                break;
                case "[悠闲]":
                this.image_x = this.width*14;
                this.image_y = this.height;
                this.isFace = true;
                break;
                case "[奋斗]":
                this.image_x = 0;
                this.image_y = this.height*2;
                this.isFace = true;
                break;
                case "[咒骂]":
                this.image_x = this.width;
                this.image_y = this.height*2;
                this.isFace = true;
                break;
                case "[疑问]":
                this.image_x = this.width*2;
                this.image_y = this.height*2;
                this.isFace = true;
                break;
                case "[嘘]":
                this.image_x = this.width*3;
                this.image_y = this.height*2;
                this.isFace = true;
                break;
                case "[晕]":
                this.image_x = this.width*4;
                this.image_y = this.height*2;
                this.isFace = true;
                break;
                case "[疯了]":
                this.image_x = this.width*5;
                this.image_y = this.height*2;
                this.isFace = true;
                break;
                case "[衰]":
                this.image_x = this.width*6;
                this.image_y = this.height*2;
                this.isFace = true;
                break;
                case "[骷髅]":
                this.image_x = this.width*7;
                this.image_y = this.height*2;
                this.isFace = true;
                break;
                case "[敲打]":
                this.image_x = this.width*8;
                this.image_y = this.height*2;
                this.isFace = true;
                break;
                case "[再见]":
                this.image_x = this.width*9;
                this.image_y = this.height*2;
                this.isFace = true;
                break;
                case "[擦汗]":
                this.image_x = this.width*10;
                this.image_y = this.height*2;
                this.isFace = true;
                break;
                case "[抠鼻]":
                this.image_x = this.width*11;
                this.image_y = this.height*2;
                this.isFace = true;
                break;
                case "[鼓掌]":
                this.image_x = this.width*12;
                this.image_y = this.height*2;
                this.isFace = true;
                break;
                case "[糗大了]":
                this.image_x = this.width*13;
                this.image_y = this.height*2;
                this.isFace = true;
                break;
                case "[坏笑]":
                this.image_x = this.width*14;
                this.image_y = this.height*2;
                this.isFace = true;
                break;
                case "[左哼哼]":
                this.image_x = 0;
                this.image_y = this.height*3;
                this.isFace = true;
                break;
                case "[右哼哼]":
                this.image_x = this.width;
                this.image_y = this.height*3;
                this.isFace = true;
                break;
                case "[哈欠]":
                this.image_x = this.width*2;
                this.image_y = this.height*3;
                this.isFace = true;
                break;
                case "[鄙视]":
                this.image_x = this.width*3;
                this.image_y = this.height*3;
                this.isFace = true;
                break;
                case "[委屈]":
                this.image_x = this.width*4;
                this.image_y = this.height*3;
                this.isFace = true;
                break;
                case "[快哭了]":
                this.image_x = this.width*5;
                this.image_y = this.height*3;
                this.isFace = true;
                break;
                case "[阴险]":
                this.image_x = this.width*6;
                this.image_y = this.height*3;
                this.isFace = true;
                break;
                case "[亲亲]":
                this.image_x = this.width*7;
                this.image_y = this.height*3;
                this.isFace = true;
                break;
                case "[吓]":
                this.image_x = this.width*8;
                this.image_y = this.height*3;
                this.isFace = true;
                break;
                case "[可怜]":
                this.image_x = this.width*9;
                this.image_y = this.height*3;
                this.isFace = true;
                break;
                case "[菜刀]":
                this.image_x = this.width*10;
                this.image_y = this.height*3;
                this.isFace = true;
                break;
                case "[西瓜]":
                this.image_x = this.width*11;
                this.image_y = this.height*3;
                this.isFace = true;
                break;
                case "[啤酒]":
                this.image_x = this.width*12;
                this.image_y = this.height*3;
                this.isFace = true;
                break;
                case "[篮球]":
                this.image_x = this.width*13;
                this.image_y = this.height*3;
                this.isFace = true;
                break;
                case "[乒乓]":
                this.image_x = this.width*14;
                this.image_y = this.height*3;
                this.isFace = true;
                break;
                case "[咖啡]":
                this.image_x = 0;
                this.image_y = this.height*4;
                this.isFace = true;
                break;
                case "[饭]":
                this.image_x = this.width;
                this.image_y = this.height*4;
                this.isFace = true;
                break;
                case "[猪头]":
                this.image_x = this.width*2;
                this.image_y = this.height*4;
                this.isFace = true;
                break;
                case "[玫瑰]":
                this.image_x = this.width*3;
                this.image_y = this.height*4;
                this.isFace = true;
                break;
                case "[凋谢]":
                this.image_x = this.width*4;
                this.image_y = this.height*4;
                this.isFace = true;
                break;
                case "[嘴唇]":
                this.image_x = this.width*5;
                this.image_y = this.height*4;
                this.isFace = true;
                break;
                case "[爱心]":
                this.image_x = this.width*6;
                this.image_y = this.height*4;
                this.isFace = true;
                break;
                case "[心碎]":
                this.image_x = this.width*7;
                this.image_y = this.height*4;
                this.isFace = true;
                break;
                case "[蛋糕]":
                this.image_x = this.width*8;
                this.image_y = this.height*4;
                this.isFace = true;
                break;
                case "[闪电]":
                this.image_x = this.width*9;
                this.image_y = this.height*4;
                this.isFace = true;
                break;
                case "[炸弹]":
                this.image_x = this.width*10;
                this.image_y = this.height*4;
                this.isFace = true;
                break;
                case "[刀]":
                this.image_x = this.width*11;
                this.image_y = this.height*4;
                this.isFace = true;
                break;
                case "[足球]":
                this.image_x = this.width*12;
                this.image_y = this.height*4;
                this.isFace = true;
                break;
                case "[瓢虫]":
                this.image_x = this.width*13;
                this.image_y = this.height*4;
                this.isFace = true;
                break;
                case "[便便]":
                this.image_x = this.width*14;
                this.image_y = this.height*4;
                this.isFace = true;
                break;
                case "[月亮]":
                this.image_x = 0;
                this.image_y = this.height*5;
                this.isFace = true;
                break;
                case "[太阳]":
                this.image_x = this.width;
                this.image_y = this.height*5;
                this.isFace = true;
                break;
                case "[礼物]":
                this.image_x = this.width*2;
                this.image_y = this.height*5;
                this.isFace = true;
                break;
                case "[拥抱]":
                this.image_x = this.width*3;
                this.image_y = this.height*5;
                this.isFace = true;
                break;
                case "[强]":
                this.image_x = this.width*4;
                this.image_y = this.height*5;
                this.isFace = true;
                break;
                case "[弱]":
                this.image_x = this.width*5;
                this.image_y = this.height*5;
                this.isFace = true;
                break;
                case "[握手]":
                this.image_x = this.width*6;
                this.image_y = this.height*5;
                this.isFace = true;
                break;
                case "[胜利]":
                this.image_x = this.width*7;
                this.image_y = this.height*5;
                this.isFace = true;
                break;
                case "[抱拳]":
                this.image_x = this.width*8;
                this.image_y = this.height*5;
                this.isFace = true;
                break;
                case "[勾引]":
                this.image_x = this.width*9;
                this.image_y = this.height*5;
                this.isFace = true;
                break;
                case "[拳头]":
                this.image_x = this.width*10;
                this.image_y = this.height*5;
                this.isFace = true;
                break;
                case "[差劲]":
                this.image_x = this.width*11;
                this.image_y = this.height*5;
                this.isFace = true;
                break;
                case "[爱你]":
                this.image_x = this.width*12;
                this.image_y = this.height*5;
                this.isFace = true;
                break;
                case "[NO]":
                this.image_x = this.width*13;
                this.image_y = this.height*5;
                this.isFace = true;
                break;
                case "[OK]":
                this.image_x = this.width*14;
                this.image_y = this.height*5;
                this.isFace = true;
                break;
                case "[爱情]":
                this.image_x = 0;
                this.image_y = this.height*6;
                this.isFace = true;
                break;
                case "[飞吻]":
                this.image_x = this.width;
                this.image_y = this.height*6;
                this.isFace = true;
                break;
                case "[跳跳]":
                this.image_x = this.width*2;
                this.image_y = this.height*6;
                this.isFace = true;
                break;
                case "[发抖]":
                this.image_x = this.width*3;
                this.image_y = this.height*6;
                this.isFace = true;
                break;
                case "[怄火]":
                this.image_x = this.width*4;
                this.image_y = this.height*6;
                this.isFace = true;
                break;
                case "[转圈]":
                this.image_x = this.width*5;
                this.image_y = this.height*6;
                this.isFace = true;
                break;
                case "[磕头]":
                this.image_x = this.width*6;
                this.image_y = this.height*6;
                this.isFace = true;
                break;
                case "[回头]":
                this.image_x = this.width*7;
                this.image_y = this.height*6;
                this.isFace = true;
                break;
                case "[跳绳]":
                this.image_x = this.width*8;
                this.image_y = this.height*6;
                this.isFace = true;
                break;
                case "[投降]":
                this.image_x = this.width*9;
                this.image_y = this.height*6;
                this.isFace = true;
                break;
                case "[激动]":
                this.image_x = this.width*10;
                this.image_y = this.height*6;
                this.isFace = true;
                break;
                case "[乱舞]":
                this.image_x = this.width*11;
                this.image_y = this.height*6;
                this.isFace = true;
                break;
                case "[献吻]":
                this.image_x = this.width*12;
                this.image_y = this.height*6;
                this.isFace = true;
                break;
                case "[左太极]":
                this.image_x = this.width*13;
                this.image_y = this.height*6;
                this.isFace = true;
                break;
                case "[右太极]":
                this.image_x = this.width*14;
                this.image_y = this.height*6;
                this.isFace = true;
                break;

                default:
                log.E("test","msg is wrong!")
                this.isFace = false;
            }
        }

    }

    //返回对应表情的下标数字
    getIndex(){
        if(this.image_y != null&&this.image_x !=null){
            let index = this.image_y/this.height*15 + this.image_x/this.width + 1;
            return index;
        }else{
            this.isFace = false;
            return null;
        }

    }

    //返回对应表情的imageView
    // getFaceVIew(){
    //
    //     let faceImage = new Image(this.image,this.image_x,this.image_y,this.width,this.height);
    //     let faceBitmap = faceImage.getBitmap();
    //     // let faceBitmap =image_test.getBitmap();
    //     let imageView = new ImageView();
    //     imageView.src = faceBitmap;
    //     imageView.background = "transparent";
    //
    //     //Image对象需尽快回收
    //     if(imageView != null){
    //         this.image.destroy();
    //         faceImage.destroy();
    //     }
    //
    //     return imageView;
    //     // return faceBitmap;
    //
    // }

    //用于表情截取后复制，from 磊哥。
    // SaveFaceView(){
    //     const APPCATION_PATH = "/opt/data/share/LanyouWx.yunospf.com/";
    //     for( let y = 0; y <= this.height*6 ; y +=this.height)
    //         for(let x = 0; x <= this.width*14; x += this.width){
    //
    //             let faceImage = new Image(this.image,x,y,this.width,this.height);
    //             // let image = null;
    //             try {
    //                 // image = new Image("/data/a.jpg");
    //                 let path =  APPCATION_PATH + "images/save" + this.index+".png";
    //                 this.index++;
    //                 log.D("test",path);
    //                 faceImage.save(path, "png", function(error) {
    //                         if (error) {
    //                             log.D("test","error!!");
    //                         }
    //                         log.D("test","successed!!");
    //                         // 成功
    //                     });
    //             } catch (e) {
    //                 log.I("test", "Exception: " + e);
    //             }
    //
    //         }
    //
    //
    // }

}

module.exports = WxFace;
