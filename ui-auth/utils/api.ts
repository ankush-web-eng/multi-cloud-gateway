import { AuthResponse, User } from '@/types/types.';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const authService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const response = await axios.post(
                `${API_URL}/auth/login`,
                { email, password },
                { withCredentials: true }
            );
            console.log('Login response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw { message: 'Login failed' };
        }
    },

    signup: async (
        email: string,
        name: string,
        phone: string,
        password: string
    ): Promise<AuthResponse> => {
        try {
            const response = await axios.post(
                `${API_URL}/auth/signup`,
                { email, name, phone, password },
                { withCredentials: true }
            );
            console.log('Signup response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Signup error:', error);
            throw { message: 'Signup failed' };
        }
    },

    requestOtp: async (
        identifier: string,
        type: 'email' | 'sms' | 'whatsapp'
    ): Promise<AuthResponse> => {
        try {
            const payload = type === 'email'
                ? { email: identifier, type }
                : { phone: identifier, type };

            const response = await axios.post(
                `${API_URL}/otp/signin`,
                payload,
                { withCredentials: true }
            );
            console.log('OTP request response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw { message: 'OTP request failed' };
        }
    },

    verifyOtp: async (
        identifier: string,
        otp: string,
        isEmail: boolean
    ): Promise<AuthResponse> => {
        try {
            const payload = isEmail
                ? { email: identifier, otp }
                : { phone: identifier, otp };

            const response = await axios.post(
                `${API_URL}/otp/otp`,
                payload,
                { withCredentials: true }
            );
            console.log('OTP verification response:', response.data);
            return response.data;
        } catch (error) {
            console.error('OTP verification error:', error);
            throw { message: 'OTP verification failed' };
        }
    },

    getUser: async (): Promise<User | null> => {
        try {
            const response = await axios.get(`${API_URL}/auth/me`, {
                withCredentials: true,
            });
            console.log('User data response:', response.data);
            return response.data.user;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    },
};