"use strict";
/* jshint unused: vars */
const View = require("yunos/ui/view/View");
const CompositeView = require("yunos/ui/view/CompositeView");
const Rectangle = require("yunos/graphics/Rectangle");
const TextView = require("yunos/ui/view/TextView");
const Switch = require("yunos/ui/widget/Switch");
const Checkmark = require("yunos/ui/widget/Checkmark");
const RelativeLayout = require("yunos/ui/layout/RelativeLayout");
const TapRecognizer = require("yunos/ui/gesture/TapRecognizer");
const PopupMenu = require("yunos/ui/widget/PopupMenu");
const PopupMenuItem = PopupMenu.PopupMenuItem;
const ConfigStore = require("yunos/content/ConfigStore");
const TAG = "MyPopupMenuItem";
//let state = false;

class MyPopupMenuItem extends PopupMenuItem {

    /**
     * var item1 = new MyPopupMenuItem("这是第一个菜单");
     *
     */
    constructor(context, text = "") {
        super(context, text);

        let sw = new Switch();
        let cs = ConfigStore.getInstance("settings");
        let state = cs.get("key", true);
        log.D("test" , "Switch初始化");
        sw.value = state;
        sw.on("valuechanged", (value) => {
            //sw.text = "value=" + value + ":";
            if (sw.value === false) {
                this.mMsgTextView.visibility = View.Visibility.Hidden;
      
                state = false;
                cs.put("key", state);
                //cs.apply();
                log.D("test" , "Switch修改为关闭写入");
                cs.apply((err) => {
                    if (err !== null) {

                    }
                });
            } else {
                state = true;
              //  this.mMsgTextView.visibility = View.Visibility.Visible;
                cs.put("key", state);
                //cs.apply();
                log.D("test" , "Switch修改为打开写入");
                cs.apply((err) => {
                    if (err !== null) {

                    }
                });
            }
        });

        this.addChild(sw);

        this.multiState = {
            normal: {
                background: "transparent"
            },
            pressed: {
                background: this._backgroundPressed
            },
            disabled: {
                background: "transparent"
            }
        };
        this.addGestureRecognizer(this._tapRecognizer = new TapRecognizer({ event: "tap" }));
        this._checkmark = new Checkmark(this._context);
        // this._checkmark.id = "checkmark";
        this._checkmark.checked = false;
        this._checkmark.responsive = false;

        this._checkmark.visibility = View.Visibility.None;

        this._checkmark.touchRegion = new Rectangle(0, 0, 0, 0);
        this.addChild(this._checkmark);


        this._checkedLayout = new RelativeLayout();
        this._checkedLayout.setLayoutParam(0, "align", { left: "parent", right: "parent", top: "parent", bottom: "parent" });
        this._checkedLayout.setLayoutParam(0, "margin", { left: this._margin, right: this._margin + this._checkmark.width });
        this._checkedLayout.setLayoutParam(1, "align", { right: "parent", middle: "parent" });
        this._checkedLayout.setLayoutParam(1, "margin", { right: this._checkmarkMarginRight });

        this._checkedLayout.setLayoutParam(2, "align", { right: "parent", middle: "parent" });
        this._checkedLayout.setLayoutParam(2, "margin", { right: this._checkmarkMarginRight });

        this._normalLayout = new RelativeLayout();
        this._normalLayout.setLayoutParam(0, "align", { left: "parent", right: "parent", top: "parent", bottom: "parent" });
        this._normalLayout.setLayoutParam(0, "margin", { left: this._margin, right: this._margin });
        this._normalLayout.setLayoutParam(1, "align", { right: "parent", middle: "parent" });
        this._normalLayout.setLayoutParam(1, "margin", { right: this._checkmarkMarginRight });

        this._normalLayout.setLayoutParam(2, "align", { right: "parent", middle: "parent" });
        this._normalLayout.setLayoutParam(2, "margin", { right: this._checkmarkMarginRight });

        this.layout = this._checkedLayout;
    }


    /**
        *
        < p > Destructor that destroy this PopupMenuItem. < /p> *
        @param { boolean } recursive - destroy the children in the PopupMenuItem
    if the value is true.*@public *
        @override *
        @since 2 *
        /
    /**
     * <p>Destructor that destroy this PopupMenuItem.</p>
     * @public
     * @since 1
     */
    destroy(recursive) {
        this.layout.destroy();
        this.layout = null;
        if (this._tapRecognizer) {
            this.removeGestureRecognizer(this._tapRecognizer);
            this._tapRecognizer = null;
        }
        if (this._checkmark) {
            this._checkmark.destroy();
            this._checkmark = null;
        }
        if (this._contentView) {
            if (this._contentView.layout) {
                this._contentView.layout.destroy();
                this._contentView.layout = null;
            }
            if (this._contentView instanceof CompositeView) {
                this._contentView.destroyAll();
                this._contentView = null;
            } else {
                this._contentView.destroy();
                this._contentView = null;
            }
        }
        if (this._textItem) {
            this._textItem = null;
        }
        super.destroy(recursive);
    }

    /**
     * <p>This property holds text of the PopupMenuItem.</p>
     * @name yunos.ui.widget.PopupMenu.PopupMenuItem#text
     * @type {string}
     * @throws {TypeError} If this value is not a string.
     * @public
     * @since 1
     */
    get text() {
        return this._textItem.text;
    }

    set text(value) {
        if (typeof value !== "string") {
            throw new TypeError("the text of PopupMenuItem must be string");
        } else {
            this._textItem.text = value;
        }
    }

    /**
     * <p>This property holds the checkmark object of the ActionMenu.</p>
     * @name yunos.ui.widget.PopupMenu.PopupMenuItem#checkmark
     * @type {yunos.ui.widget.Checkmark}
     * @readonly
     * @public
     * @since 1
     */
    get checkmark() {
        return this._checkmark;
    }

    /**
     * <p>Get stylename of this view.</p>
     * @name yunos.ui.widget.PopupMenuItem#styleName
     * @type {string}
     * @readonly
     * @private
     * @override
     */
    get styleName() {
        return "PopupMenuItem";
    }

    /**
     * <p>Get the content view. When designing an PopupMenuItem with customized style, override this method.</p>
     * <p>Note that you must also override text api when you override this function in your customized PopupMenuItem.</p>
     * @param {string} text - the title of item.
     * @returns {yunos.ui.view.View} the content view.
     * @protected
     * @since 1
     */
    getContentView(text) {
        // this.layout.setLayoutParam("contentView", "align", {left: "parent", right: "parent", top: "parent", bottom: "parent"});
        // this.layout.setLayoutParam("contentView", "margin", {left: this._margin, right: this._margin});
        let cv = this._textItem = new TextView(this._context);
        this._textItem.id = "contentView";
        this._textItem.fontSize = this._fontSize;
        this._textItem.color = this._textColor;
        this._textItem.elideMode = TextView.ElideMode.ElideRight;
        if (typeof text === "string") {
            this._textItem.text = text;
        } else {
            throw new TypeError("the text of ActionMenuItem must be string");
        }
        return cv;
    }

    /**
     * <p>Apply theme style for popup menu.</p>
     * @override
     * @protected
     * @since 1
     */
    applyStyle() {
        let style = this._style;
        this._margin = style.margin;
        this._dividerColor = style.dividerColor;
        this._dividerWidth = style.dividerWidth;
        this._textColor = style.textColor;
        this._fontSize = style.fontSize;
        this._backgroundPressed = style.backgroundPressed;
        this._defaultHeight = style.height;
        this._defaultWidth = style.width;
        this._checkmarkMarginRight = style.checkmarkMarginRight;

        this.bottomLineColor = this._dividerColor;
        this.bottomLineHeight = this._dividerWidth;
    }

}

PopupMenu.PopupMenuItem = PopupMenuItem;

module.exports = MyPopupMenuItem;
