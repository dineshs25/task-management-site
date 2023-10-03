import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { server } from '../server';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './navbar';

const Preview = () => {
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


    return (
        <div>
            <Navbar id={id} />
            <div className='my-16 mx-16 rounded-2xl h-[600px] bg-gray-50 overflow-scroll'>
                <div className='w-8/12 mx-auto h-[100%]'>
                    <h2 className='text-center text-indigo-500 py-4 font-semibold text-4xl'>Preview Task</h2>


                    <div className='w-full'>
                        <div className='mb-4'>
                            <label htmlFor='title' className='block font-semibold pb-2'>
                                Title
                            </label>
                            <p className=' rounded border-2 p-2 border-indigo-500'>{newTask?.title}</p>
                        </div>
                        <div>
                            <label htmlFor='description' className='block font-semibold pb-2'>
                                Description
                            </label>
                            <p className=' rounded border-2 p-2 border-indigo-500'>{newTask?.description}</p>
                        </div>

                    </div>



                </div>
            </div>
        </div>
    );
}

export default Preview