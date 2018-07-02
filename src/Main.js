"use strict";
// Temporary, removed before release

process.env.CAFUI2 = true;

// const mWxModule = require("./WebWxModule/wx_module").getInstance();
const RequireRouter = require("./RequireRouter");
var Page = require("yunos/page/Page");
const ImageView = require("yunos/ui/view/ImageView");
const View = require("yunos/ui/view/View");
const LayoutManager = require("yunos/ui/markup/LayoutManager");
var imageLoader = require("yunos/util/ImageLoader").getInstance();
// const Contact = require("./Contact");
const ListView = require("yunos/ui/view/ListView");
const CompositeView = require("yunos/ui/view/CompositeView");
const RelativeLayout = require("yunos/ui/layout/RelativeLayout");
const TextView = require("yunos/ui/view/TextView");
const ChatAdapter = require("./adapter/ChatAdapter");
const ContactAdapter = require("./adapter/ContactAdapter");
const AlertDialog = require("yunos/ui/widget/AlertDialog");
const Loading = require("yunos/ui/widget/Loading");
const PopupMenu = require("yunos/ui/widget/PopupMenu");
const Button = require("yunos/ui/widget/Button");
const ImageButton = require("yunos/ui/widget/ImageButton");
const RowLayout = require("yunos/ui/layout/RowLayout");
const resource = require("yunos/content/resource/Resource").getInstance();


const TAG = "WebWx_Main";

class Main extends Page {

    onCreate() {
        this.parent = this.window;
    }

    onBackKey() {
        let dialog = new AlertDialog();
        dialog.title = "退出";
        dialog.message = "您确定要退出吗？";
        dialog.buttons = [{ text: "取消" }, { text: "确定", color: AlertDialog.TextColor.Positive }];

        dialog.on("result", (index) => {
            if (index == 0) {
                dialog.close();
            } else if (index == 1) {
                this.stopPage();
            }
        });
        dialog.show();
        return true;
    }

    onStart() {
        this.mWxModule = RequireRouter.getRequire("./WebWxModule/wx_module").getInstance();
        //  LayoutManager.load("main", (err, rootView) => {
        // if (err) throw err;
        //      rootView.width = this.window.width;
        //      rootView.height = this.window.height;
        //      this.window.addChild(rootView);
        //    this.QRCodeIV = rootView.findViewById("QRCodeIv");
        //     this.QRCodeIV.scaleType = ImageView.ScaleType.Center;
        //     this.TipsTV = rootView.findViewById("TipsTV");
        // putBtn.on("tap", ()=> {
        //     log.D(TAG, "tap", putBtn.text);
        // });
        // });
        this.initLoadingView();
        this.initCallBack();
    }

    initLoadingView() {
        LayoutManager.load("main", (err, rootView) => {
            rootView.width = this.window.width;
            rootView.height = this.window.height;
            this.window.addChild(rootView);
            this.QRCodeIV = rootView.findViewById("QRCodeIv");
            this.QRCodeIV.scaleType = ImageView.ScaleType.Center;
            this.TipsTV = rootView.findViewById("TipsTV");
        });
    }

    initCallBack() {
        this.mWxModule.on("friend", (msg) => {
            if (msg !== null && msg.Content !== "" && this.isLopped) {
                /**/
                let displayMsg = "新消息 ";
                if (msg.Member.RemarkName !== "") {
                    displayMsg += msg.Member.RemarkName;
                } else {
                    displayMsg += msg.Member.NickName;
                }
                displayMsg += ": " + msg.Content;
                this.mMsgTextView.text = displayMsg;
                log.D(TAG, "displayMsg = " + displayMsg);
            }
        });
        this.mWxModule.on("group", (msg) => {
            if (msg !== null && msg.Content !== "" && this.isLopped) {
                this.mMsgTextView.text = "来自群 ${msg.Group.NickName} 的消息${msg.GroupMember.DisplayName || msg.GroupMember.NickName}: ${msg.Content}";
                let displayMsg = "来自群 " + msg.Group.NickName + " 的消息";
                if (msg.GroupMember.DisplayName !== "") {
                    displayMsg += msg.GroupMember.DisplayName;
                } else {
                    displayMsg += msg.GroupMember.NickName;
                }
                displayMsg += ": " + msg.Content;
                this.mMsgTextView.text = displayMsg;
                log.D(TAG, "displayMsg = " + displayMsg);
            }
        });

        this.mWxModule.on("msg", (msg) => {
            if (this.ChatWithUserName && msg.WithUserName === this.ChatWithUserName) {
                this.refreshMsgPart(this.ChatWithUserName);
            }
            this.refreshContactPart(msg.WithUserName);
        });

        this.mWxModule.on("qrcode", (url) => {
            imageLoader.displayImage(this.QRCodeIV, url);
        });
        this.mWxModule.on("logged", () => {
            // this.QRCodeIV.visibility = View.Visibility.Hidden;
            this.TipsTV.text = "已登录!";
            // let isLooped = this.mWxModule.isLooped();
            // log.I(TAG , "mWxModule.isLooped() = " + isLooped);
            // let link = new PageLink("page://LanyouWx.yunos.com/ChatPage");
            // Page.getInstance().sendLink(link);
            this.window.removeAllChildren();
            this.initView();
        });
        this.mWxModule.on("scaned", () => {
            this.TipsTV.text = "二维码已被扫描，请确认登录!";
        });

        this.mWxModule.on("u_contacts", () => {
            log.D(TAG, "getRecentContacts..");
            this.mWxModule.getRecentContacts().then((result) => {
                this.mContactLV.ContactsList = result;
                log.D(TAG, "position = " + result[1].Name);
                this.initDatas(result);
            });
        });

        //手机微信退出时，restart界面
        this.mWxModule.on("restart", () => {
            log.I("test", "界面restart");
            this.window.removeAllChildren();
            if (this.optionsMenu != null) {
                this.optionsMenu.close();
            }
            if (this.textInuputMenu != null) {
                this.textInuputMenu.close();
            }
            this.initLoadingView();
        });

        //在uuid获取失败和登录检查失败时，打印连接异常
        this.mWxModule.on("connectErro", () => {
            this.TipsTV.text = "连接异常，请检查网络！";
        });


        //联系人界面时网络异常处理
        this.mWxModule.on("connectErro2", (needAlert) => {


        });

        this.mWxModule.doRun();
    }

    initView() {
        // this.mWxModule = require("./WebWxModule/wx_module").getInstance();
        this.mWxModule = RequireRouter.getRequire("./WebWxModule/wx_module").getInstance();
        let width = this.window.width;
        let height = this.window.height;

        this.mMainView = new CompositeView();
        this.mMainLayout = new RelativeLayout();
        this.mMainView.layout = this.mMainLayout;
        this.mMainView.width = width;
        this.mMainView.height = height;

        // 左侧最近联系人栏.
        this.mContactLV = new ListView();
        this.mContactLV.id = "contactlv";
        this.mContactLV.width = width / 3;
        this.mContactLV.height = height;

        this.mContactLV.on("itemselect", this.onContactLvSelect);
        this.mContactLV.page = this;

        // 右上侧菜单按钮
        let optionsBtn = new ImageButton();
        optionsBtn.styleType = ImageButton.StyleType.Block;
        optionsBtn.multiState = {
            focused: {
                background: "#FFFFFF",
                opacity: 0
            },
            pressed: {
                background: "#FFFFFF",
                opacity: 0
            }
        };
        optionsBtn.src = resource.getImageSrc("/images/setting.png");

        optionsBtn.height = 30;
        optionsBtn.width = 30;
        optionsBtn.on("tap", () => {
            let left = optionsBtn.left;
            let top = optionsBtn.top;
            let parent = optionsBtn.parent;
            while (parent) {
                left += parent.left;
                top += parent.top;
                parent = parent.parent;
            }
            left -= this.optionsMenu.width - optionsBtn.width;
            top += optionsBtn.height;
            this.optionsMenu.show(left, top);
        });

        this.optionsMenu = new PopupMenu();
        let items = [
            new PopupMenu.PopupMenuItem("自动播报"),
            new PopupMenu.PopupMenuItem("新手指南"),
            new PopupMenu.PopupMenuItem("登出")
        ];
        for (let item of items) {
            this.optionsMenu.addChild(item);
        }
        this.optionsMenu.on("result", (index) => {
            //通过index跳转实现不同的界面与功能。
        });

        // 右上侧对话框.
        this.mTitleView = new CompositeView();
        this.mTitleView.id = "titleview";
        let titleLayout = new RelativeLayout();
        this.mTitleView.layout = titleLayout;
        this.contactNameTV = new TextView();
        this.contactNameTV.fontSize = "12sp";
        this.contactNameTV.text = "";
        this.mTitleView.width = width - this.mContactLV.width;
        this.mTitleView.height = 60;
        let divider = new View(this._context);
        divider.height = 1;
        divider.width = width - this.mContactLV.width;
        divider.id = "divider";
        // divider.background = this._style.dividerColor;
        divider.background = "#e5e5e5";
        this.mTitleView.addChild(this.contactNameTV);
        this.mTitleView.addChild(optionsBtn);
        this.mTitleView.addChild(divider);
        titleLayout.setLayoutParam(0, "align", { right: "parent", middle: "parent" });
        titleLayout.setLayoutParam(0, "margin", { right: 60 });
        titleLayout.setLayoutParam(1, "align", { right: "parent", middle: "parent" });
        titleLayout.setLayoutParam(1, "margin", { right: 15 });
        titleLayout.setLayoutParam("divider", "align", {
            bottom: "parent",
            right: "parent",
            left: "parent"
        });

        // 右下侧最近联系人栏.
        this.mChatLV = new ListView();
        this.mChatLV.id = "chatlv";
        this.mChatLV.width = width - this.mContactLV.width;
        this.mChatLV.height = height - 60;

        // 消息栏
        this.mMsgTextView = new TextView();
        this.mMsgTextView.id = "msgtv";
        this.mMsgTextView.width = width / 2;
        this.mMsgTextView.height = 60; // top: "parent",middle: "parent"
        this.mMsgTextView.background = "#D9D9D9";
        this.mMsgTextView.opacity = 0.6;
        this.mMsgTextView.text = "";
        this.mMsgTextView.fontSize = "12sp";
        this.mMsgTextView.verticalAlign = TextView.VerticalAlign.Middle;

        this.loading = new Loading();
        this.loading.id = "loading";
        this.loading.sizeStyle = Loading.SizeStyle.Big;

        // 右下侧输入栏
        this.inputView = new CompositeView();
        this.inputView.id = "input_view";
        this.inputView.height = 30;
        this.inputView.width = this.mChatLV.width;
        let inputLayout = new RowLayout();
        inputLayout.spacing = 0;
        this.inputView.layout = inputLayout;

        let emojiBtn = new Button();
        emojiBtn.sizeType = Button.SizeType.Small;
        emojiBtn.buttonColor = "rgba(123,127,141,0.6)";
        emojiBtn.text = "表情";
        emojiBtn.height = this.inputView.height;
        emojiBtn.width = this.inputView.width / 2;
        let textInputBtn = new Button();
        textInputBtn.sizeType = Button.SizeType.Small;
        textInputBtn.buttonColor = "rgba(123,127,141,0.6)";
        textInputBtn.height = this.inputView.height;
        textInputBtn.width = this.inputView.width / 2;
        textInputBtn.text = "默认输入";
        textInputBtn.on("tap", () => {
            let left = textInputBtn.left;
            let top = textInputBtn.top;
            let parent = textInputBtn.parent;
            while (parent) {
                left += parent.left;
                top += parent.top;
                parent = parent.parent;
            }
            top -= textInputBtn.height + this.textInuputMenu.height;
            this.textInuputMenu.show(left, top);
        });

        this.defaultMsg = ["你好！", "我正在開車呢，稍後給您回電話.", "[微笑]"];
        this.textInuputMenu = new PopupMenu();
        this.textInuputMenu.width = textInputBtn.width;
        let textInputItems = [
            new PopupMenu.PopupMenuItem(this.defaultMsg[0]),
            new PopupMenu.PopupMenuItem(this.defaultMsg[1]),
            new PopupMenu.PopupMenuItem(this.defaultMsg[2])
        ];
        for (let item of textInputItems) {
            this.textInuputMenu.addChild(item);
        }
        this.textInuputMenu.on("result", (index) => {
            if (this.ChatWithUserName) {
                this.mWxModule.sendText(this.ChatWithUserName, this.defaultMsg[index]);
            }
        });

        this.inputView.visibility = View.Visibility.Hidden;
        this.inputView.addChild(emojiBtn);
        this.inputView.addChild(textInputBtn);


        this.mMainView.addChild(this.mContactLV); // 0
        this.mMainView.addChild(this.mTitleView); // 1
        this.mMainView.addChild(this.mChatLV); // 2
        this.mMainView.addChild(this.mMsgTextView); // 3
        this.mMainView.addChild(this.loading); // 4
        this.mMainView.addChild(this.inputView);

        this.loading.start();
        this.mMainLayout.setLayoutParam("contactlv", "align", { left: "parent", top: "parent" });
        this.mMainLayout.setLayoutParam("titleview", "align", { left: { target: "contactlv", side: "right" }, top: "parent" });
        this.mMainLayout.setLayoutParam("chatlv", "align", { left: { target: "contactlv", side: "right" }, top: { target: "titleview", side: "bottom" } });
        this.mMainLayout.setLayoutParam("msgtv", "align", { top: "parent", center: "parent" });
        this.mMainLayout.setLayoutParam("loading", "align", { center: "parent", middle: "parent" });
        this.mMainLayout.setLayoutParam("input_view", "align", { left: { target: 0, side: "right" }, bottom: "parent" });
        this.mMainLayout.setLayoutParam("contactlv", "margin", { top: this.window.statusBarHeight });
        this.mMainLayout.setLayoutParam("titleview", "margin", { top: this.window.statusBarHeight });
        this.mMainLayout.setLayoutParam("chatlv", "margin", { bottom: 30 });
        this.mMainLayout.setLayoutParam("msgtv", "margin", { top: this.window.statusBarHeight });
        this.window.addChild(this.mMainView);
    }

    onContactLvSelect(itemView, position) {
        log.D(TAG, "position = " + position);
        // log.D(TAG, "position = " + this.ContactsList[position].Name);
        // log.D(TAG, itemView);
        if (this.currentItem) {
            this.currentItem.background = "#FFFFFF";
        }
        this.page.contactNameTV.text = this.ContactsList[position].Name;
        itemView.background = "#F2F2F2";
        this.page.ChatWithUserName = this.ContactsList[position].UserName;
        this.currentItem = itemView;
        this.page.refreshMsgPart.call(this.page, this.ContactsList[position].UserName);


        // 去掉最近聊天欄目的小紅點.
        this.ContactsList[position].hasNewMsg = false;
        this.page.mContactAdapter.data = this.page.mContactLV.ContactsList;
        this.page.mContactAdapter.onDataChange();
    }

    initDatas(contacts_data) {
        this.mMsgTextView.text = "數據加載中...";
        log.I(TAG, "contacts_data = " + contacts_data.length);
        this.mContactAdapter = new ContactAdapter(this.mWxModule);
        this.mContactAdapter.data = contacts_data;
        this.mContactLV.adapter = this.mContactAdapter;

        this.chatAdapter = new ChatAdapter(this.mWxModule);
        // this.chatAdapter.data = this.getMsgList();
        this.mChatLV.adapter = this.chatAdapter;
        // let isLooped = this.mWxModule.isLooped();
        this.dataReady();
        this.isLopped = true;
    }

    dataReady() {
        if (this.mMsgTextView) {
            this.mMainView.removeChild(this.loading);
            this.mMsgTextView.text = "";
            this.inputView.visibility = View.Visibility.Visible;
        }
    }


    // 更新....
    refreshContactPart(WithUserName) {
        if (!this.isLopped) return;
        let index;
        for (let i = 0; i < this.mContactLV.ContactsList.length; i++) {
            if (this.mContactLV.ContactsList[i].UserName === WithUserName) {
                index = i;
                break;
            }
        }
        log.D(TAG, "refreshContactPart index = " + index);
        if (index) {
            let _contact = this.mContactLV.ContactsList.splice(index, 1);
            _contact[0].hasNewMsg = true;
            this.mContactLV.ContactsList.unshift(_contact[0]);
            this.mContactAdapter.data = this.mContactLV.ContactsList;
            this.mContactAdapter.onDataChange();
        }
    }


    refreshMsgPart(FromUserName) {
        if (!this.isLopped) return;
        // log.D(TAG, "onContactLvSelect =" + this);
        log.I(TAG, "refreshMsgPart.. = " + FromUserName);
        this.mWxModule.getMsgListByWithUserName(FromUserName).then((ret) => {
            log.I(TAG, ret);
            log.I(TAG, ret.length);
            this.chatAdapter.data = this.getMsgList(ret);
            this.chatAdapter.onDataChange();
            this.mChatLV.arriveAt(this.chatAdapter.getCount() - 1);
        });
    }


    getMsgList(pMsgList) {
        if (!this.chatList) {
            this.chatList = new Array();
        }
        this.chatList.splice(0, this.chatList.length);
        for (let i = 0; i < pMsgList.length; i++) {
            this.chatList.push(pMsgList[i]);
        }
        let _msg = new Object();
        _msg.WithUserName = "";
        this.chatList.push(_msg);
        return this.chatList;
    }
}
module.exports = Main;
