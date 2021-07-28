"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
require('@electron/remote/main').initialize();
// process.env["NODE_OPTIONS"] = '--no-force-async-hooks-checks';
// app.commandLine.appendSwitch('high-dpi-support', 'true');
// app.allowRendererProcessReuse = false;
// app.commandLine.appendSwitch('trace-warnings');
var idDev = process.argv.slice(1).some(function (val) { return val === '--serve'; });
var window;
function createWindow() {
    window = new electron_1.BrowserWindow({
        x: 0,
        y: 0,
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (idDev) ? true : false,
            contextIsolation: false,
            enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
        },
        closable: true,
        hasShadow: false,
    });
    if (idDev) {
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/node_modules/electron")
        });
        window.loadURL('http://localhost:4203/');
        window.webContents.openDevTools();
    }
    else {
        window.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true,
        }));
        window.webContents.openDevTools();
    }
    return window;
}
var gotTheLock = electron_1.app.requestSingleInstanceLock();
if (!gotTheLock) {
    electron_1.app.quit();
}
else {
    try {
        electron_1.app.on('ready', function () {
            setTimeout(createWindow, 0);
        });
        electron_1.app.on('second-instance', function () {
            if (window) {
                if (window.isMinimized())
                    window.restore();
                window.focus();
            }
        });
    }
    catch (e) {
        console.error(e);
    }
}
//# sourceMappingURL=main.js.map