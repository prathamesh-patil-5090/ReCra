import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Fixed import path
import Spinner from './common/Spinner';
import { Github, Mail } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError('All fields are required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) return;

        try {
            setIsLoading(true);
            await login({
                email: formData.email,
                password: formData.password,
                remember: formData.rememberMe
            });
            navigate('/'); // Changed from /dashboard to /
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white max-w-md w-full space-y-6 p-8 rounded-lg border-2 border-black shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Login to Your Account
                </h2>
                
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition-colors duration-300 outline-none peer"
                            placeholder=" "
                        />
                        <label 
                            htmlFor="email" 
                            className="absolute left-4 top-3 text-gray-500 transition-all duration-300 pointer-events-none
                                     peer-focus:-translate-y-7 peer-focus:text-[12px] peer-focus:text-black
                                     peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-[12px]"
                        >
                            Email address
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition-colors duration-300 outline-none peer"
                            placeholder=" "
                        />
                        <label 
                            htmlFor="password"
                            className="absolute left-4 top-3 text-gray-500 transition-all duration-300 pointer-events-none
                                     peer-focus:-translate-y-7 peer-focus:text-[12px] peer-focus:text-black
                                     peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-[12px]"
                        >
                            Password
                        </label>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            <label htmlFor="rememberMe" className="ml-2 text-gray-600">
                                Remember me
                            </label>
                        </div>
                        <Link to="/forgot-password" className="text-black hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="transition-all hover:scale-105 hover:shadow-lg w-full rounded-lg bg-black px-8 py-3.5 text-white transition-colors hover:bg-gray-800 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                        >
                            {isLoading ? <Spinner /> : 'Login'}
                        </button>
                        <Link 
                            to="/signup"
                            className="transition-all hover:scale-105 hover:shadow-lg w-full rounded-lg border border-gray-300 bg-white px-8 py-3.5 text-gray-600 transition-colors hover:bg-gray-50 font-medium text-center"
                        >
                            Sign up
                        </Link>
                    </div>
                </form>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => window.location.href='/auth/google'}
                        className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <Mail className="h-5 w-5 mr-2" />
                        Google
                    </button>
                    <button 
                        onClick={() => window.location.href='/auth/github'}
                        className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <Github className="h-5 w-5 mr-2" />
                        GitHub
                    </button>
                </div>

                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm animate-shake" role="alert">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;