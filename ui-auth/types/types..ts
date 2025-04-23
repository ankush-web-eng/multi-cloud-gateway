export interface User {
    email: string;
    name: string;
    phone: string;
}

export interface AuthResponse {
    message: string;
    user?: User;
    error?: any;
}