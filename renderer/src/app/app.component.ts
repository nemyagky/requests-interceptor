import {Component, ElementRef, ViewChild} from '@angular/core';
import {ElectronService} from "./core/services/electron.service";
import {HTMLLinksArray, LinksWindowData} from "./core/interfaces/links-window-data.interface";

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

        this.electronService.ipcRenderer.on('links-update', (event, outerLinks: string[]) => {
            this.container.nativeElement.innerHTML = '';

            const links: LinksWindowData = this.parseLinks(outerLinks);
            links.textLinks = this.sortTextLinks(links.textLinks);

            links.imageLinks.forEach(el => this.container.nativeElement.appendChild(el))
            links.textLinks.forEach(el => this.container.nativeElement.appendChild(el))
        });
    }

    private parseLinks(outerLinks: string[]): LinksWindowData {
        const links: LinksWindowData = {
            imageLinks: [],
            textLinks: []
        }

        outerLinks.forEach((link) => {
            let htmlElement: ChildNode | HTMLElement = new DOMParser().parseFromString(link, 'text/html').body.firstChild;

            if (htmlElement.firstChild.nodeName === '#text' || (htmlElement.firstChild as HTMLElement).tagName === 'SPAN') {
                links.textLinks.push(htmlElement);
            } else {
                links.imageLinks.push(htmlElement);
            }
        });

        return links;
    }

    private sortTextLinks(textLinks: HTMLLinksArray): HTMLLinksArray {
        return textLinks.sort((first, second) => {
            return first.textContent.trim() > second.textContent.trim() ? 1 : -1;
        })
    }

}