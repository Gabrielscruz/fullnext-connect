export interface accessLinkProps {
    id: number
    label: string
    defaultIcon: string
    href: string
}

export interface AccessControlProps {
    id: number;
    name: string;
    accessLinks: accessLinkProps[]
}


