"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var init_service_1 = require("./main/core/services/init.service");
require('@electron/remote/main').initialize();
electron_1.app.on('ready', function () {
    setTimeout(function () { return init_service_1.InitService.init(); }, 0);
});
//# sourceMappingURL=main.js.map