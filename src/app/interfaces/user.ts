export interface User {
    displayName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role?: string;
    photoURL?:string;
    Address?:string;
}
export interface UserLogin {
    email: string;
    password: string;    
}
