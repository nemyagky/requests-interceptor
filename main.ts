import {app} from 'electron';
import {InitService} from "./main/core/services/init.service";

require('@electron/remote/main').initialize();

app.on('ready', () => {
    setTimeout(() => InitService.init(), 0);
});

//         this.isDev = process.argv.slice(1).some(val => val === '--serve');

// TODO Глянь на это, мб нужно включить в билд чтоб стабильнее было
// process.env["NODE_OPTIONS"] = '--no-force-async-hooks-checks';
// app.commandLine.appendSwitch('high-dpi-support', 'true');
// app.allowRendererProcessReuse = false;
// app.commandLine.appendSwitch('trace-warnings');
