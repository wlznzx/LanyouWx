"use strict"
const ImageView = require("yunos/ui/view/ImageView");
const Bitmap = require("yunos/graphics/Bitmap");
const Image = require("yunos/multimedia/Image");
const resource = require("yunos/content/resource/Resource").getInstance();

class WxFace{
    constructor(){

        this.isFace = false;

        if(arguments.length == 1){
            this.msg = arguments[0];
            this.onlyJudgeIndex(this.msg);
        }else if(arguments.length == 2){
            let x = arguments[0];
            let y = arguments[1];
            if(typeof x == "number"){
                this.msg = this.getFaceMsg(x);
                this.index = x;
                this.isFace = true;
            }else {
                this.isFace = false;
            }
        }else{
            log.E("test","argument.length is wrong!");
            this.isFace = false;
        }

    }

    //判断该表情所在位置，并返回对应msg；
    getFaceMsg(index){
        switch(index){
            case 0:
                return "[微笑]";
            case 1:
                return "[撇嘴]";
            case 2:
                return "[色]";
            case 3:
                return "[发呆]";
            case 4:
                return "[得意]";
            case 5:
                return "[流泪]";
            case 6:
                return "[害羞]";
            case 7:
                return "[闭嘴]";
            case 8:
                return "[睡]";
            case 9:
                return "[大哭]";
            case 10:
                return "[尴尬]";
            case 11:
                return "[发怒]";
            case 12:
                return "[调皮]";
            case 13:
                return "[呲牙]";
            case 14:
                return "[惊讶]";
            case 15:
                return "[难过]";
            case 16:
                return "[酷]";
            case 17:
                return "[冷汗]";
            case 18:
                return "[抓狂]";
            case 19:
                return "[吐]";
            case 20:
                return "[偷笑]";
            case 21:
                return "[愉快]";
            case 22:
                return "[白眼]";
            case 23:
                return "[傲慢]";
            case 24:
                return "[饥饿]";
            case 25:
                return "[困]";
            case 26:
                return "[惊恐]";
            case 27:
                return "[流汗]";
            case 28:
                return "[憨笑]";
            case 29:
                return "[悠闲]";
            case 30:
                return "[奋斗]";
            case 31:
                return "[咒骂]";
            case 32:
                return "[疑问]";
            case 33:
                return "[嘘]";
            case 34:
                return "[晕]";
            case 35:
                return "[疯了]";
            case 36:
                return "[衰]";
            case 37:
                return "[骷髅]";
            case 38:
                return "[敲打]";
            case 39:
                return "[再见]";
            case 40:
                return "[擦汗]";
            case 41:
                return "[抠鼻]";
            case 42:
                return "[鼓掌]";
            case 43:
                return "[糗大了]";
            case 44:
                return "[坏笑]";
            case 45:
                return "[左哼哼]";
            case 46:
                return "[右哼哼]";
            case 47:
                return "[哈欠]";
            case 48:
                return "[鄙视]";
            case 49:
                return "[委屈]";
            case 50:
                return "[快哭了]";
            case 51:
                return "[阴险]";
            case 52:
                return "[亲亲]";
            case 53:
                return "[吓]";
            case 54:
                return "[可怜]";
            case 55:
                return "[菜刀]";
            case 56:
                return "[西瓜]";
            case 57:
                return "[啤酒]";
            case 58:
                return "[篮球]";
            case 59:
                return "[乒乓]";
            case 60:
                return "[咖啡]";
            case 61:
                return "[饭]";
            case 62:
                return "[猪头]";
            case 63:
                return "[玫瑰]";
            case 64:
                return "[凋谢]";
            case 65:
                return "[嘴唇]";
            case 66:
                return "[爱心]";
            case 67:
                return "[心碎]";
            case 68:
                return "[蛋糕]";
            case 69:
                return "[闪电]";
            case 70:
                return "[炸弹]";
            case 71:
                return "[刀]";
            case 72:
                return "[足球]";
            case 73:
                return "[瓢虫]";
            case 74:
                return "[便便]";
            case 75:
                return "[月亮]";
            case 76:
                return "[太阳]";
            case 77:
                return "[礼物]";
            case 78:
                return "[拥抱]";
            case 79:
                return "[强]";
            case 80:
                return "[弱]";
            case 81:
                return "[握手]";
            case 82:
                return "[胜利]";
            case 83:
                return "[抱拳]";
            case 84:
                return "[勾引]";
            case 85:
                return "[拳头]";
            case 86:
                return "[差劲]";
            case 87:
                return "[爱你]";
            case 88:
                return "[NO]";
            case 89:
                return "[OK]";
            case 90:
                return "[爱情]";
            case 91:
                return "[飞吻]";
            case 92:
                return "[跳跳]";
            case 93:
                return "[发抖]";
            case 94:
                return "[怄火]";
            case 95:
                return "[转圈]";
            case 96:
                return "[磕头]";
            case 97:
                return "[回头]";
            case 98:
                return "[跳绳]";
            case 99:
                return "[投降]";
            default:
                log.E("test","msg is wrong!")
                this.isFace = false;
            }

    }

    onlyJudgeIndex(msg){
        if(typeof(msg) !== "string"){
            log.E("test","msg is not string!!");
            this.isFace = false;
            //未抛出异常
        }else{
            switch(msg){
                case "[微笑]":
                this.index = 0;
                this.isFace = true;
                break;
                case "[撇嘴]":
                this.index = 1;
                this.isFace = true;
                break;
                case "[色]":
                this.index = 2;
                this.isFace = true;
                break;
                case "[发呆]":
                this.index = 3;
                this.isFace = true;
                break;
                case "[得意]":
                this.index = 4;
                this.isFace = true;
                break;
                case "[流泪]":
                this.index = 5;
                this.isFace = true;
                break;
                case "[害羞]":
                this.index = 6;
                this.isFace = true;
                break;
                case "[闭嘴]":
                this.index = 7;
                this.isFace = true;
                break;
                case "[睡]":
                this.index = 8;
                this.isFace = true;
                break;
                case "[大哭]":
                this.index = 9;
                this.isFace = true;
                break;
                case "[尴尬]":
                this.index = 10;
                this.isFace = true;
                break;
                case "[发怒]":
                this.index = 11;
                this.isFace = true;
                break;
                case "[调皮]":
                this.index = 12;
                this.isFace = true;
                break;
                case "[呲牙]":
                this.index = 13;
                this.isFace = true;
                break;
                case "[惊讶]":
                this.index = 14;
                this.isFace = true;
                break;
                case "[难过]":
                this.index = 15;
                this.isFace = true;
                break;
                case "[酷]":
                this.index = 16;
                this.isFace = true;
                break;
                case "[冷汗]":
                this.index = 17;
                this.isFace = true;
                break;
                case "[抓狂]":
                this.index = 18;
                this.isFace = true;
                break;
                case "[吐]":
                this.index = 19;
                this.isFace = true;
                break;
                case "[偷笑]":
                this.index = 20;
                this.isFace = true;
                break;
                case "[愉快]":
                this.index = 21;
                this.isFace = true;
                break;
                case "[白眼]":
                this.index = 22;
                this.isFace = true;
                break;
                case "[傲慢]":
                this.index = 23;
                this.isFace = true;
                break;
                case "[饥饿]":
                this.index = 24;
                this.isFace = true;
                break;
                case "[困]":
                this.index = 25;
                this.isFace = true;
                break;
                case "[惊恐]":
                this.index = 26;
                this.isFace = true;
                break;
                case "[流汗]":
                this.index = 27;
                this.isFace = true;
                break;
                case "[憨笑]":
                this.index = 28;
                this.isFace = true;
                break;
                case "[悠闲]":
                this.index = 29;
                this.isFace = true;
                break;
                case "[奋斗]":
                this.index = 30;
                this.isFace = true;
                break;
                case "[咒骂]":
                this.index = 31;
                this.isFace = true;
                break;
                case "[疑问]":
                this.index = 32;
                this.isFace = true;
                break;
                case "[嘘]":
                this.index = 33;
                this.isFace = true;
                break;
                case "[晕]":
                this.index = 34;
                this.isFace = true;
                break;
                case "[疯了]":
                this.index = 35;
                this.isFace = true;
                break;
                case "[衰]":
                this.index = 36;
                this.isFace = true;
                break;
                case "[骷髅]":
                this.index = 37;
                this.isFace = true;
                break;
                case "[敲打]":
                this.index = 38;
                this.isFace = true;
                break;
                case "[再见]":
                this.index = 39;
                this.isFace = true;
                break;
                case "[擦汗]":
                this.index = 40;
                this.isFace = true;
                break;
                case "[抠鼻]":
                this.index = 41;
                this.isFace = true;
                break;
                case "[鼓掌]":
                this.index = 42;
                this.isFace = true;
                break;
                case "[糗大了]":
                this.index = 43;
                this.isFace = true;
                break;
                case "[坏笑]":
                this.index = 44;
                this.isFace = true;
                break;
                case "[左哼哼]":
                this.index = 45;
                this.isFace = true;
                break;
                case "[右哼哼]":
                this.index = 46;
                this.isFace = true;
                break;
                case "[哈欠]":
                this.index = 47;
                this.isFace = true;
                break;
                case "[鄙视]":
                this.index = 48;
                this.isFace = true;
                break;
                case "[委屈]":
                this.index = 49;
                this.isFace = true;
                break;
                case "[快哭了]":
                this.index = 50;
                this.isFace = true;
                break;
                case "[阴险]":
                this.index = 51;
                this.isFace = true;
                break;
                case "[亲亲]":
                this.index = 52;
                this.isFace = true;
                break;
                case "[吓]":
                this.index = 53;
                this.isFace = true;
                break;
                case "[可怜]":
                this.index = 54;
                this.isFace = true;
                break;
                case "[菜刀]":
                this.index = 55;
                this.isFace = true;
                break;
                case "[西瓜]":
                this.index = 56;
                this.isFace = true;
                break;
                case "[啤酒]":
                this.index = 57;
                this.isFace = true;
                break;
                case "[篮球]":
                this.index = 58;
                this.isFace = true;
                break;
                case "[乒乓]":
                this.index = 59;
                this.isFace = true;
                break;
                case "[咖啡]":
                this.index = 60;
                this.isFace = true;
                break;
                case "[饭]":
                this.index = 61;
                this.isFace = true;
                break;
                case "[猪头]":
                this.index = 62;
                this.isFace = true;
                break;
                case "[玫瑰]":
                this.index = 63;
                this.isFace = true;
                break;
                case "[凋谢]":
                this.index = 64;
                this.isFace = true;
                break;
                case "[嘴唇]":
                this.index = 65;
                this.isFace = true;
                break;
                case "[爱心]":
                this.index = 66;
                this.isFace = true;
                break;
                case "[心碎]":
                this.index = 67;
                this.isFace = true;
                break;
                case "[蛋糕]":
                this.index = 68;
                this.isFace = true;
                break;
                case "[闪电]":
                this.index = 69;
                this.isFace = true;
                break;
                case "[炸弹]":
                this.index = 70;
                this.isFace = true;
                break;
                case "[刀]":
                this.index = 71;
                this.isFace = true;
                break;
                case "[足球]":
                this.index = 72;
                this.isFace = true;
                break;
                case "[瓢虫]":
                this.index = 73;
                this.isFace = true;
                break;
                case "[便便]":
                this.index = 74;
                this.isFace = true;
                break;
                case "[月亮]":
                this.index = 75;
                this.isFace = true;
                break;
                case "[太阳]":
                this.index = 76;
                this.isFace = true;
                break;
                case "[礼物]":
                this.index = 77;
                this.isFace = true;
                break;
                case "[拥抱]":
                this.index = 78;
                this.isFace = true;
                break;
                case "[强]":
                this.index = 79;
                this.isFace = true;
                break;
                case "[弱]":
                this.index = 80;
                this.isFace = true;
                break;
                case "[握手]":
                this.index = 81;
                this.isFace = true;
                break;
                case "[胜利]":
                this.index = 82;
                this.isFace = true;
                break;
                case "[抱拳]":
                this.index = 83;
                this.isFace = true;
                break;
                case "[勾引]":
                tthis.index = 84;
                this.isFace = true;
                break;
                case "[拳头]":
                this.index = 85;
                this.isFace = true;
                break;
                case "[差劲]":
                this.index = 86;
                this.isFace = true;
                break;
                case "[爱你]":
                this.index = 87;
                this.isFace = true;
                break;
                case "[NO]":
                this.index = 88;
                this.isFace = true;
                break;
                case "[OK]":
                this.index = 89;
                this.isFace = true;
                break;
                case "[爱情]":
                this.index = 90;
                this.isFace = true;
                break;
                case "[飞吻]":
                this.index = 91;
                this.isFace = true;
                break;
                case "[跳跳]":
                this.index = 92;
                this.isFace = true;
                break;
                case "[发抖]":
                this.index = 93;
                this.isFace = true;
                break;
                case "[怄火]":
                this.index = 94;
                this.isFace = true;
                break;
                case "[转圈]":
                this.index = 95;
                this.isFace = true;
                break;
                case "[磕头]":
                this.index = 96;
                this.isFace = true;
                break;
                case "[回头]":
                this.index = 97;
                this.isFace = true;
                break;
                case "[跳绳]":
                this.index = 98;
                this.isFace = true;
                break;
                case "[投降]":
                this.index = 99;
                this.isFace = true;
                break;

                default:
                log.E("test","msg is wrong!")
                this.isFace = false;
            }

        }
    }

}

module.exports = WxFace;
