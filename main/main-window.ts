import {BrowserWindow, session} from 'electron';


export const MainWindowService = new class MainWindowServiceSingleton {

    private browserWindow: BrowserWindow;
    private defaultUrl: string = 'https://ozon.ru/';
    private sessionPartition: string;
    private session: session;


    public createBrowserWindow(): void {
        this.initSession();
        this.initMainWindow();
    }

    public async loadWebSite(): Promise<void> {
        await this.browserWindow.loadURL(this.defaultUrl);
    }

    private initSession(): void {
        this.sessionPartition = 'persist:main-window';
        this.session = session.fromPartition(this.sessionPartition);
    }

    private initMainWindow(): void {
        this.browserWindow = this.browserWindowConstructor();

        this.browserWindow.removeMenu();
        this.browserWindow.maximize();
        this.browserWindow.webContents.openDevTools();

    }

    private browserWindowConstructor(): BrowserWindow {
        return new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                allowRunningInsecureContent: true,
                contextIsolation: false,
                enableRemoteModule: true,
                partition: this.sessionPartition
            },
            show: true
        });
    }

    public getBrowserWindow(): BrowserWindow {
        return this.browserWindow;
    }

    public getSession(): session {
        return this.session;
    }
}
