"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var init_service_1 = require("./main/core/services/init.service");
require('@electron/remote/main').initialize();
electron_1.app.on('ready', function () {
    setTimeout(function () { return init_service_1.InitService.init(); }, 0);
});
//         this.isDev = process.argv.slice(1).some(val => val === '--serve');
// TODO Глянь на это, мб нужно включить в билд чтоб стабильнее было
// process.env["NODE_OPTIONS"] = '--no-force-async-hooks-checks';
// app.commandLine.appendSwitch('high-dpi-support', 'true');
// app.allowRendererProcessReuse = false;
// app.commandLine.appendSwitch('trace-warnings');
//# sourceMappingURL=main.js.map