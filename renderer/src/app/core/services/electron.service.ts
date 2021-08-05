import {Injectable} from '@angular/core';
import {ipcRenderer} from 'electron';


@Injectable({
    providedIn: 'root'
})

export class ElectronService {

    public ipcRenderer: typeof ipcRenderer;

    private get isElectron(): boolean {
        return !!(window && window.process && window.process.type);
    }

    constructor() {
        if (this.isElectron) {
            this.ipcRenderer = window.require('electron').ipcRenderer;
        }
    }
}
