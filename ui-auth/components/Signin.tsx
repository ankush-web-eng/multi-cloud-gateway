import React, { useState } from 'react';
// import { FaGoogle, FaApple } from 'react-icons/fa';
import { FaEnvelope, FaPhone, FaWhatsapp } from 'react-icons/fa';
import { authService } from '@/utils/api';
import Image from 'next/image';
import { User } from '@/types/types.';

interface SignInProps {
    onSuccess: (user: User) => void;
    onToggleForm: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onSuccess, onToggleForm }) => {
    const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [otpMethod, setOtpMethod] = useState<'email' | 'sms' | 'whatsapp'>('email');
    const [otp, setOtp] = useState<string>('');
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(email, password);
            onSuccess(response.user!);
        } catch (error) {
            console.log(error);
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const identifier = otpMethod === 'email' ? email : phone;

        try {
            await authService.requestOtp(identifier, otpMethod);
            setIsOtpSent(true);
        } catch (err) {
            console.error(err);
            setError('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const identifier = otpMethod === 'email' ? email : phone;
        const isEmail = otpMethod === 'email';

        try {
            const response = await authService.verifyOtp(identifier, otp, isEmail);
            onSuccess(response.user!);
        } catch (err) {
            console.error(err);
            setError('Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
            <div className="flex justify-center mb-6">
                <Image
                    src="/favicon.ico"
                    alt="Logo"
                    height={10}
                    width={10}
                    unoptimized
                    fetchPriority='high'
                    className="h-10 w-10 rounded-full"
                />
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign in</h2>

            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
                    {error}
                </div>
            )}

            <div className="mb-6">
                <div className="flex border-b border-gray-300">
                    <button
                        onClick={() => setAuthMethod('password')}
                        className={`flex-1 py-2 text-center font-medium ${authMethod === 'password'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500'
                            }`}
                    >
                        Password
                    </button>
                    <button
                        onClick={() => setAuthMethod('otp')}
                        className={`flex-1 py-2 text-center font-medium ${authMethod === 'otp'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500'
                            }`}
                    >
                        OTP
                    </button>
                </div>
            </div>

            {authMethod === 'password' ? (
                <form onSubmit={handlePasswordLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            ) : (
                <div>
                    {!isOtpSent ? (
                        <form onSubmit={handleRequestOtp}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Choose OTP Method
                                </label>
                                <div className="flex space-x-3 mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setOtpMethod('email')}
                                        className={`flex items-center justify-center px-4 py-2 rounded-md ${otpMethod === 'email'
                                            ? 'bg-blue-100 text-blue-600 border border-blue-300'
                                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}
                                    >
                                        <FaEnvelope className="mr-2" />
                                        Email
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setOtpMethod('sms')}
                                        className={`flex items-center justify-center px-4 py-2 rounded-md ${otpMethod === 'sms'
                                            ? 'bg-blue-100 text-blue-600 border border-blue-300'
                                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}
                                    >
                                        <FaPhone className="mr-2" />
                                        SMS
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setOtpMethod('whatsapp')}
                                        className={`flex items-center justify-center px-4 py-2 rounded-md ${otpMethod === 'whatsapp'
                                            ? 'bg-blue-100 text-blue-600 border border-blue-300'
                                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}
                                    >
                                        <FaWhatsapp className="mr-2" />
                                        WhatsApp
                                    </button>
                                </div>
                            </div>

                            {otpMethod === 'email' ? (
                                <div className="mb-6">
                                    <label htmlFor="otpEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        id="otpEmail"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="+1 (555) 123-4567"
                                        required
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp}>
                            <div className="mb-6">
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter OTP
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="123456"
                                    maxLength={6}
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    OTP sent to {otpMethod === 'email' ? email : phone}
                                </p>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOtpSent(false)}
                                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {loading ? 'Verifying...' : 'Verify'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
                        Google
                    </button>
                    <button
                        type="button"
                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FaApple className="h-5 w-5 text-gray-900 mr-2" />
                        Apple
                    </button>
                </div>
            </div> */}

            <p className="mt-8 text-center text-sm text-gray-600">
                Don&aops;t have an account?{' '}
                <button
                    onClick={onToggleForm}
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    Sign up
                </button>
            </p>
        </div>
    );
};