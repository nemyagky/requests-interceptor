import {Component, ElementRef, ViewChild} from '@angular/core';
import {ElectronService} from "./core/services/electron.service";
import {HTMLLinksArray} from "./core/interfaces/links-window-data.interface";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

// Angular part is really small, so, only AppComponent was created
// And it's dirty a little bit :)
export class AppComponent {

    @ViewChild('container') container: ElementRef;
    private textLinks: HTMLLinksArray = [];
    private imageLinks: HTMLLinksArray = [];

    constructor(
        private electronService: ElectronService,
    ) {
        this.subscribeOnLinksUpdate();
    }

    private subscribeOnLinksUpdate(): void {
        this.electronService.ipcRenderer.on('links-update', (event, outerLinks: string[]) => {
            this.clearLinks();

            this.parseOuterLinks(outerLinks);
            this.sortTextLinks();
            this.updateLinksInView();
        });
    }

    private parseOuterLinks(outerLinks: string[]): void {
        outerLinks.forEach((link) => {
            let htmlElement: ChildNode | HTMLElement = new DOMParser().parseFromString(link, 'text/html').body.firstChild;

            if (htmlElement.firstChild.nodeName === '#text' || (htmlElement.firstChild as HTMLElement).tagName === 'SPAN') {
                this.textLinks.push(htmlElement);
            } else {
                this.imageLinks.push(htmlElement);
            }
        });
    }

    private sortTextLinks(): void {
        this.textLinks = this.textLinks.sort((first, second) => {
            return first.textContent.trim() > second.textContent.trim() ? 1 : -1;
        })
    }

    // updating by nativeElement.appendChild due to performance && i'm lazy :D
    private updateLinksInView(): void {
        const linksContainer = document.createDocumentFragment();

        this.imageLinks.forEach(el => linksContainer.appendChild(el));
        this.textLinks.forEach(el => linksContainer.appendChild(el));

        this.container.nativeElement.appendChild(linksContainer);
    }

    private clearLinks(): void {
        this.container.nativeElement.innerHTML = '';

        this.textLinks = [];
        this.imageLinks = [];
    }

}