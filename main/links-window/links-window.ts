import {BrowserWindow} from 'electron';


export const LinksWindowService = new class LinksWindowServiceSingleton {

    private browserWindow: BrowserWindow;

    public init(): void {
        this.initBrowserWindow();
    }

    private initBrowserWindow(): void {
        this.browserWindow = this.browserWindowConstructor();

        this.browserWindow.removeMenu();
        this.browserWindow.maximize();
        this.browserWindow.webContents.openDevTools();
    }

    public async loadWebSite(): Promise<void> {
        await this.browserWindow.loadURL('http://localhost:4203/');
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