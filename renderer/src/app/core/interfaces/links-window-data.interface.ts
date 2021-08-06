export interface LinksWindowData {
    imageLinks: HTMLLinksArray;
    textLinks: HTMLLinksArray;
}

export type HTMLLinksArray = (ChildNode | HTMLElement)[];
