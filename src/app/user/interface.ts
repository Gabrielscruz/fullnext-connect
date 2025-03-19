export interface UserProps {
    id: number;
    profileUrl: string;
    name: string;
    email: string;
    admin: boolean;
    about: string;
    dateOfBirth: string;
    accessControl: { id: number, name: string }
}