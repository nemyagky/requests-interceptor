import {BrowserWindow} from 'electron';
import * as fs from 'fs';
import * as path from 'path';



export const NavigationSequenceService = new class NavigationSequenceServiceSingleton {

    private browserWindow: BrowserWindow;

    public init(browserWindow: BrowserWindow): void {
        this.browserWindow = browserWindow;

        this.insertJSIntoBrowserWindow();
        this.subscribeOnClicks();
    }

    private insertJSIntoBrowserWindow(): void {
        this.browserWindow.webContents.executeJavaScript(`
            window.addEventListener('click', (event) => {
                event.path.forEach(el => {
                    if (el.tagName === 'A') {
                        console.log('LinkWasClicked' + ' ' + window.location.href + ' ' + 'CLICK' + ' ' + el.href);
                        event.preventDefault();
                    }
                });
            });
        `);
    }

    private subscribeOnClicks(): void {
        this.browserWindow.webContents.on('console-message', (event, level, message) => {
            if (message.includes('LinkWasClicked')) {
                const data = message.split(' ');

                this.logToFile({
                    pageUrl: data[1],
                    event: data[2],
                    linkUrl: data[3]
                })
            }
        });

    }

    private logToFile(info): void {
        const pathName = '../../../navigation-sequence.json'
        const navigationSequence = require(pathName);
        navigationSequence.push(info);

        fs.writeFile(
            path.join(__dirname, pathName),
            JSON.stringify(navigationSequence, null, 2),
            (e) => e ? console.log(e) : null
        );
    }

}