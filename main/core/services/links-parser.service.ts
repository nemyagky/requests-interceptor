import {BrowserWindow} from 'electron';

export const LinksParserService = new class LinksParserServiceSingleton {

    private mainWindow: BrowserWindow;
    private linksWindow: BrowserWindow;

    public async init(mainWindow: BrowserWindow, linksWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
        this.linksWindow = linksWindow;

        await this.insertJSIntoBrowserWindow();
    }

    private async insertJSIntoBrowserWindow(): Promise<void> {
        const links = await this.mainWindow.webContents.executeJavaScript(`
            [...document.body.getElementsByTagName("a")].map(el => el.outerHTML)
        `);

        this.updateLinksView(links);
    }

    private updateLinksView(links: []) {
        this.linksWindow.webContents.send('links-update', links);
    }

}