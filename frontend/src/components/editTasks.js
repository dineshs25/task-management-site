import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { server } from '../server';
import { toast } from 'react-toastify';
import Navbar from './navbar';

const EditTasks = ({ taskID }) => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [newTask, setNewTask] = useState({ title: '', description: '' });

    useEffect(() => {
        const apiCall = async () => {
            try {
                const response = await axios.get(`${server}/getTask/${id}`, {
                    withCredentials: true,
                });
                setNewTask(response.data.task);
            } catch (err) {
                toast.error(err.response.data.error);
                // navigate('/')
            }
        };
        apiCall();
    }, [id, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    }

    const updateTask = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${server}/update/${id}`, newTask, {
                withCredentials: true,
            });
            toast.success("task updated successfully");
        } catch (err) {
            toast.error(err.response.data.error);
            navigate('/')
        }
    }


    return (
        <div>
            <Navbar id={id} />
            <div className='my-16 mx-16 rounded-2xl h-[600px] bg-gray-50'>
                <div className='w-8/12 mx-auto h-[100%]'>
                    <h2 className='text-center text-indigo-500 py-4'>Edit Task</h2>


                    <form onSubmit={updateTask}>
                        <div className='w-full'>
                            <div className='mb-4'>
                                <label htmlFor='title' className='block font-semibold pb-2'>
                                    Title
                                </label>
                                <input
                                    type='text'
                                    id='title'
                                    name='title'
                                    value={newTask?.title}
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
                                    value={newTask?.description}
                                    onChange={handleChange}
                                    className='w-full px-3 py-2 border rounded-lg'
                                    placeholder='Enter description'
                                />
                            </div>
                            <button
                                type='submit'
                                className='mt-4 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600'
                            >
                                Update Task
                            </button>
                        </div>
                    </form>



                </div>
            </div>
        </div>
    );
}

export default EditTasks