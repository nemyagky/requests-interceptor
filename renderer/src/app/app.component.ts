import {Component, ElementRef, ViewChild} from '@angular/core';
import {ElectronService} from "./core/services/electron.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})


export class AppComponent {

    @ViewChild('container') container:ElementRef;


    constructor(
        private electronService: ElectronService,
    ) {

        this.electronService.ipcRenderer.on('links-update', (event, links: string[]) => {
            links.forEach((el) => {
                this.container.nativeElement.insertAdjacentHTML('beforeend', el);
            });

            console.log(this.container, links);
        })

    }

}