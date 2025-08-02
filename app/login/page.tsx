"use client";
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();

    const [user, setUser] = React.useState({
        email: '',
        password: ''

    });
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    useState(false);


    const [loading, setLoading] = React.useState(false);

    const onLogin = async () => {
        try{
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            toast.success("Login success");
            router.push("/profile");

        }catch(error:any){
            console.log("Login failed", error.message);
            toast.error(error.message);

        }finally {
            setLoading(false);

        }

    };
    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);


        }else{
            setButtonDisabled(true);
        }

    }, [user])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card Container */}
                <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">{loading ? "Processing" : "Login"}</h1>
                        <p className="text-gray-300">One more Step!..</p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200 outline-none"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={user.password}
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                                placeholder="Create a password"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200 outline-none"
                                required
                            />
                        </div>

                        {/* Sign Up Button */}
                        <button
                            onClick={onLogin}
                            disabled={loading}
                            className="w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    logging in..
                                </div>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-8 text-center">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-gray-800 text-gray-400">Didn't have an account?</span>
                            </div>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/signup"
                            className="text-gray-300 hover:text-white font-medium transition duration-200"
                        >
                            Create an account
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}