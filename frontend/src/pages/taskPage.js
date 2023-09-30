import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import { server } from '../server';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/navbar';

const TaskPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const apiCall = async () => {
            try {
                await axios.get(`${server}/getUser`, {
                    withCredentials: true,
                });
            } catch (err) {
                toast.error(err.response.data.error);
                navigate('/')
            }
        };
        apiCall();
    }, [id, navigate])


    const [newTask, setNewTask] = useState({ title: '', description: '' });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    }

    const addTask = async () => {
        try {
            await axios.post(`${server}/addTask`, newTask, {
                withCredentials: true,
            });
            toast.success("Added New Task Successfully")
        } catch (err) {
            toast.error(err.response.data.error);
            navigate('/')
        }
    };


    return (
        <div>
            <Navbar id={id} />
            <div className='my-16 mx-16 rounded-2xl lg:h-[600px] h-[400px] bg-gray-50'>
                <div className='w-8/12 mx-auto h-[100%]'>
                    <h2 className='text-center text-indigo-500 py-4 '>Add New Task</h2>

                    <div className='w-full'>
                        <div className='mb-4'>
                            <label htmlFor='title' className='block font-semibold pb-2'>
                                Title
                            </label>
                            <input
                                type='text'
                                id='title'
                                name='title'
                                value={newTask.title}
                                onChange={handleChange}
                                className='w-full px-3 py-2 border rounded-lg'
                                placeholder='Enter title'
                            />
                        </div>
                        <div>
                            <label htmlFor='description' className='block font-semibold pb-2'>
                                Description
                            </label>
                            <textarea
                                id='description'
                                name='description'
                                value={newTask.description}
                                onChange={handleChange}
                                className='w-full px-3 py-2 border rounded-lg'
                                placeholder='Enter description'
                            />
                        </div>
                        <button
                            onClick={addTask}
                            className='mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600'
                        >
                            Add New Task
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TaskPage;
