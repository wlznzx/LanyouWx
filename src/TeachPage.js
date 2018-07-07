"use strict";
// Temporary, removed before release
process.env.CAFUI2 = true;
const Page = require("yunos/page/Page");
// const RelativeLayout = require("yunos/ui/layout/RelativeLayout");
// const CompositeView = require("yunos/ui/view/CompositeView");
// const TextView = require("yunos/ui/view/TextView");
// const Button = require("yunos/ui/widget/Button");
//const PageLink = require("yunos/page/PageLink");
const LayoutManager = require("yunos/ui/markup/LayoutManager");

class TeachPage extends Page {
    onStart() {
        let self = this;
        LayoutManager.load("teachPage", (err, rootView) => {
            if (!err) {
                self.window.addChild(rootView);
                self.window.findViewById("bt").addEventListener("tap", () => {
                    this.window.stopPage();
                });

            }
        });
    }
}
module.exports = TeachPage;
