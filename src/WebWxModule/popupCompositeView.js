var Dialog = require("yunos/ui/widget/Dialog");


class popupCompositeView extends Dialog {
    constructor() {
        super();
        this.background = "transparent";
        // this.animation_top = 383;

    }
    destroy() {
        // destroy your new created objects
        super.destroy();
    }

    initializeView() {
        super.initializeView();
        this.opacity = 0;
        this.dialogType = Dialog.DialogType.Customized;
        this.dialogLevel = Dialog.DialogLevel.Application;
        this.closeOnTouchOutside = true;
        this.showingMask = false;
    }

    // get animation_top(){
    //     return this.animation_top;
    // }
    //
    // set animation_top(value){
    //     this.animation_top = value;
    // }


    prepareForShowing(x, y) {
        // this.calculateShowPosition(x, y);
        this.showingAnimation.to = {opacity: 1, top: this.animation_top};
    }

    prepareForClosing() {
        this.closingAnimation.to = {opacity: 0, top: this.animation_top};
    }


    //这个方法在popupMenu设置 top: this._endY值的，在这个视图js中已写死。
    // calculateShowPosition(x, y) {
    //     if (this.width + x + this._gapDistance < this._windowWidth - this._minDistanceToScreen) {
    //         this.left = x + this._gapDistance;
    //     } else {
    //         this.left = this._windowWidth - this._minDistanceToScreen - this.width;
    //     }
    //     if (super.height + y + this._gapDistance < this._windowHeight - this._minDistanceToScreen) {
    //         this._endY = y + this._gapDistance;
    //         this._startY = this._endY - this._animationDistance;
    //     } else {
    //         this._endY = this._windowHeight - super.height - this._minDistanceToScreen;
    //         this._startY = this._endY + this._animationDistance;
    //     }
    //     this.top = this._startY;
    // }

}
module.exports = popupCompositeView;
