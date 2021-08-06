import {app, BrowserWindow} from 'electron';
import * as fs from 'fs';
import * as path from 'path';


export const LinksSequenceService = new class LinksSequenceServiceSingleton {

    private browserWindow: BrowserWindow;

    public startLogging(browserWindow: BrowserWindow): void {
        this.browserWindow = browserWindow;
        this.createLogFileIfMissing();

        this.executeJSToHandleClicks();
        this.subscribeOnLinksClicks();
    }

    private executeJSToHandleClicks(): void {
        this.browserWindow.webContents.executeJavaScript(`
            window.addEventListener('click', (event) => {
                event.path.forEach(el => {
                    if (el.tagName === 'A') {
                        console.log('LinkWasClicked' + ' ' + window.location.href + ' ' + 'CLICK' + ' ' + el.href);
                    }
                });
            });
        `);
    }

    private subscribeOnLinksClicks(): void {
        this.browserWindow.webContents.on('console-message', (event, level, message) => {
            if (message.includes('LinkWasClicked')) {
                const data = message.split(' ');

                this.logLink({
                    pageUrl: data[1],
                    event: data[2],
                    linkUrl: data[3]
                })
            }
        });

    }

    private logLink(info): void {
        const navigationSequence = require(this.getLogPath());
        navigationSequence.push(info);

        fs.writeFile(
            this.getLogPath(),
            JSON.stringify(navigationSequence, null, 2),
            (e) => e ? console.log(e) : null
        );
    }

    private createLogFileIfMissing(): void {
        if (!fs.existsSync(this.getLogPath())) {
            fs.writeFile(
                this.getLogPath(),
                JSON.stringify([]),
                (e) => e ? console.log(e) : null
            );
        }
    }


    private getLogPath(): string {
        return path.join(app.getAppPath(), 'links-sequence.json')
    }

}