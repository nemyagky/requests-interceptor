import {app, screen, BrowserWindow} from 'electron';
import * as path from 'path';
import * as url from 'url';


require('@electron/remote/main').initialize();

// process.env["NODE_OPTIONS"] = '--no-force-async-hooks-checks';
// app.commandLine.appendSwitch('high-dpi-support', 'true');
// app.allowRendererProcessReuse = false;
// app.commandLine.appendSwitch('trace-warnings');

const idDev = process.argv.slice(1).some(val => val === '--serve');
let window: BrowserWindow;

function createWindow(): BrowserWindow {

    window = new BrowserWindow({
        x: 0,
        y: 0,
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (idDev) ? true : false,
            contextIsolation: false,  // false if you want to run 2e2 test with Spectron
            enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
        },
        closable: true,
        hasShadow: false,
    });



    if (idDev) {
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });

        window.loadURL('http://localhost:4203/');
        window.webContents.openDevTools();

    } else {
        window.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true,
        }))
        window.webContents.openDevTools();
    }

    return window;
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit();
} else {
    try {
        app.on('ready', () => {
            setTimeout(createWindow, 0);
        });

        app.on('second-instance', () => {
            if (window) {
                if (window.isMinimized()) window.restore();
                window.focus();
            }
        })

    } catch (e) {
        console.error(e);
    }
}

