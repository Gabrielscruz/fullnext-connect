export interface LinkUsageProps {
    createdAt: string;
    menuLinkId: number;
    label: string;
    userId: number
    name: string;
    accessControlId: number;
    accesscontrolname: string;
    qtd: number;
    duration: number;
}

export interface OptionProps {
    value: number | string;
    label: string
}
