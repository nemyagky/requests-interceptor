import {MainWindowService} from "../../main-window";
import {LinksWindowService} from "../../links-window/links-window";
import {InterceptorService} from "./interceptor.service";
import {RequestsLoggerService} from "./requests-logger.service";
import {LinksSequenceService} from "./links-sequence.service";
import {LinksWindowUpdateService} from "./links-window-update.service";

// The most massive application file, responsible for initializing the entire application. 
// We should refactor it in future
export const InitService = new class InitServiceSingleton {

    public async init(): Promise<void> {
        this.initBrowserWindows();
        await this.initRequestsInterception();
        await this.loadWebSites();
        this.startLoggingLinksSequence();
        await this.initLinksWindowUpdates();
    }

    private initBrowserWindows(): void {
        MainWindowService.createBrowserWindow();
        LinksWindowService.createBrowserWindow();
    }

    private async initRequestsInterception(): Promise<void> {
        const session = MainWindowService.getSession();

        await RequestsLoggerService.connectDb();
        await InterceptorService.startIntercepting(session);
    }

    private async loadWebSites(): Promise<void> {
        await MainWindowService.loadWebSite();
        await LinksWindowService.loadWebSite();
    }

    private startLoggingLinksSequence(): void {
        const mainWindow = MainWindowService.getBrowserWindow();

        LinksSequenceService.startLogging(mainWindow);
    }

    private async initLinksWindowUpdates(): Promise<void> {
        const mainWindow = MainWindowService.getBrowserWindow();
        const linksWindow = LinksWindowService.getBrowserWindow();

        await LinksWindowUpdateService.startUpdatingLinks(mainWindow, linksWindow);
    }

}
