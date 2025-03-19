export interface LinkProps {
    id: number;
    label: string;
    defaultIcon: string;
    module: {id: number, title: string, defaultIcon: string, activeIcon: string}
    menuLinkType:  {id: number, name: string}
}