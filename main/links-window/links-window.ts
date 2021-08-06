import {app, BrowserWindow} from 'electron';
import * as url from 'url';
import * as path from 'path';


export const LinksWindowService = new class LinksWindowServiceSingleton {

    private browserWindow: BrowserWindow;

    public createBrowserWindow(): void {
        this.browserWindow = this.browserWindowConstructor();

        this.browserWindow.removeMenu();
        this.browserWindow.maximize();
        // this.browserWindow.webContents.openDevTools();
    }

    public async loadWebSite(): Promise<void> {
        const serve = process.argv.slice(1).some(val => val === '--serve');

        if (serve) {
            await this.browserWindow.loadURL('http://localhost:4288/');
        } else {
            await this.browserWindow.loadURL(url.format({
                pathname: path.join(app.getAppPath(), 'dist/index.html'),
                protocol: 'file:',
                slashes: true
            }))
        }
    }

    public getBrowserWindow(): BrowserWindow {
        return this.browserWindow;
    }

    private browserWindowConstructor(): BrowserWindow {
        return new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                allowRunningInsecureContent: true,
                contextIsolation: false,
                enableRemoteModule: true,
            }
        });
    }
}