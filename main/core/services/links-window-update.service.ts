import {BrowserWindow} from 'electron';

export const LinksWindowUpdateService = new class LinksWindowUpdateServiceSingleton {

    private mainWindow: BrowserWindow;
    private linksWindow: BrowserWindow;

    public async startUpdatingLinks(mainWindow: BrowserWindow, linksWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
        this.linksWindow = linksWindow;

        await this.updateLinks();
    }

    public async updateLinks(): Promise<void> {
        const links = await this.mainWindow.webContents.executeJavaScript(`
            [...document.body.getElementsByTagName("a")].map(el => el.outerHTML)
        `);

        this.linksWindow.webContents.send('links-update', links);
    }

}