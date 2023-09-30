// Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CredForm from './credForm';
import axios from 'axios';
import { server } from '../server';
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const hanldeSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${server}/login`, formData, { withCredentials: true });
            const id = data?.user._id
            toast.success("Login Success!");
            navigate(`/tasks/${id}`);
        }
        catch (err) {
            toast.error(err.response.data.error);
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 border-2 border-indigo-500 p-8 rounded-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={hanldeSubmit}>
                    <CredForm handleChange={handleChange} />
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign In
                        </button>
                        <p className='text-center pt-3 font-semibold'>Not yet registered? <span className='text-indigo-600'><Link to={"/register"}>Register here</Link ></span></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
