import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Fixed import path

const SignUp = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
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
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            setError('All fields are required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (!formData.acceptTerms) {
            setError('Please accept the terms and conditions');
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
            await signup({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });
            navigate('/'); // Changed from /dashboard to /
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>  
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white max-w-md w-full space-y-6 p-8 rounded-lg border-2 border-black shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Create Your Account
                </h2>
                
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition-colors duration-300 outline-none peer"
                                placeholder=" "
                            />
                            <label htmlFor="firstName" className="absolute left-4 top-3 text-gray-500 transition-all duration-300 pointer-events-none peer-focus:-translate-y-7 peer-focus:text-[12px] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-[12px]">
                                First Name
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition-colors duration-300 outline-none peer"
                                placeholder=" "
                            />
                            <label htmlFor="lastName" className="absolute left-4 top-3 text-gray-500 transition-all duration-300 pointer-events-none peer-focus:-translate-y-7 peer-focus:text-[12px] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-[12px]">
                                Last Name
                            </label>
                        </div>
                    </div>

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
                        <label htmlFor="email" className="absolute left-4 top-3 text-gray-500 transition-all duration-300 pointer-events-none peer-focus:-translate-y-7 peer-focus:text-[12px] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-[12px]">
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
                        <label htmlFor="password" className="absolute left-4 top-3 text-gray-500 transition-all duration-300 pointer-events-none peer-focus:-translate-y-7 peer-focus:text-[12px] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-[12px]">
                            Password
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-black focus:border-black transition-colors duration-300 outline-none peer"
                            placeholder=" "
                        />
                        <label htmlFor="confirmPassword" className="absolute left-4 top-3 text-gray-500 transition-all duration-300 pointer-events-none peer-focus:-translate-y-7 peer-focus:text-[12px] peer-focus:text-black peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-[12px]">
                            Confirm Password
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="acceptTerms"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                        />
                        <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600">
                            I accept the <Link to="/terms" className="text-black hover:underline">Terms and Conditions</Link>
                        </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="transition-all hover:scale-105 hover:shadow-lg w-full rounded-lg bg-black px-8 py-3.5 text-white transition-colors hover:bg-gray-800 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                        <Link 
                            to="/login"
                            className="transition-all hover:scale-105 hover:shadow-lg w-full rounded-lg border border-gray-300 bg-white px-8 py-3.5 text-gray-600 transition-colors hover:bg-gray-50 font-medium text-center"
                        >
                            Login Instead
                        </Link>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
};

export default SignUp;
