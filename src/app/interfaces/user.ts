export interface User {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    role?: string;
}
export interface UserLogin {
    email: string;
    password: string;    
}
