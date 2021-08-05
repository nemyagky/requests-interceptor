import {BrowserView, session} from 'electron';
import {InterceptionService} from "../core/services/intercept.service";
const https = require('https')


// I dont know how to call this service so it would be "Ozon"
export const OzonViewService = new class OzonViewServiceSingleton {

    private browserView: BrowserView;
    private sessionPartition: string;
    private session: session;

    public init(mainWindowBounds): BrowserView {
        this.initSession();
        this.initBrowserView(mainWindowBounds);

        InterceptionService.init(this.session);
        return this.browserView;
    }

    private initBrowserView(mainWindowBounds): void {
        this.browserView = new BrowserView({
            webPreferences: {partition: this.sessionPartition}
        });

        this.browserView.setBounds({x: 0, y: 0, width: mainWindowBounds.width, height: mainWindowBounds.height});
        this.browserView.setAutoResize({width: true, height: true});
        this.browserView.webContents.loadURL('https://google.com/');
        this.browserView.setBackgroundColor('#10F0F0');
    }

    private initSession(): void {
        this.sessionPartition = 'persist:ozon-view';
        this.session = session.fromPartition(this.sessionPartition);
    }
}