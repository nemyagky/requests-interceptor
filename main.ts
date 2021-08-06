import {app} from 'electron';
import {InitService} from "./main/core/services/init.service";

require('@electron/remote/main').initialize();

app.on('ready', () => {
    setTimeout(() => InitService.init(), 0);
});
