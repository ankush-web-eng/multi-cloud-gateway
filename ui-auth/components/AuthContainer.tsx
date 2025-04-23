
import React, { useState } from 'react';
import { SignIn } from './Signin';
import { SignUp } from './SignUp';
import { User } from '@/types/types.';

interface AuthContainerProps {
    onAuthSuccess: (user: User) => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onAuthSuccess }) => {
    const [isSignIn, setIsSignIn] = useState<boolean>(true);

    const toggleForm = () => {
        setIsSignIn(!isSignIn);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {isSignIn ? (
                    <SignIn onSuccess={onAuthSuccess} onToggleForm={toggleForm} />
                ) : (
                    <SignUp onSuccess={onAuthSuccess} onToggleForm={toggleForm} />
                )}
            </div>
        </div>
    );
};

export default AuthContainer;