import {MainWindowService} from "../../main-window";
import {RequestsLoggerService} from "./requests-logger.service";
import {InterceptionService} from "./intercept.service";
import {NavigationSequenceService} from "./navigation-sequence.service";
import {LinksParserService} from "./links-parser.service";
import {LinksWindowService} from "../../links-window/links-window";


export const InitService = new class InitServiceSingleton {

    public async init(): Promise<void> {
        MainWindowService.init();
        LinksWindowService.init();

        const session = MainWindowService.getSession();
        const mainWindow = MainWindowService.getBrowserWindow();
        const linksWindow = LinksWindowService.getBrowserWindow();


        await RequestsLoggerService.init();
        await InterceptionService.init(session);
        NavigationSequenceService.init(mainWindow);

        await MainWindowService.loadWebSite();
        await LinksWindowService.loadWebSite();
        await LinksParserService.init(mainWindow, linksWindow);
    }

}