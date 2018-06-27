/**
 * Copyright (C) 2017 Alibaba Group Holding Limited. All Rights Reserved.
 */
"use strict";
var RequireRoot = {};// 缓存机制，已经引入的不需要每次require

class RequireRouter {
    static getRequire(RequirePath) {
        // log.D(TAG, "RequireRouter:" + RequirePath + ":exit:" + (RequireRoot[RequirePath] ? "true" : "false"));
        let mode = RequireRoot[RequirePath];
        return mode ? mode : RequireRoot[RequirePath] = require(RequirePath);
    }
}
module.exports = RequireRouter;
