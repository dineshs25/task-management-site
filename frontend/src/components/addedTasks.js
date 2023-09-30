import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { server } from '../server';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from './navbar';

const AddedTasks = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const apiCall = async () => {
            try {
                const response = await axios.get(`${server}/getTasks`, {
                    withCredentials: true,
                });
                setTasks(response.data.tasks);
                setLoading(false);
            } catch (err) {
                toast.error(err.response.data.error);
                navigate('/')
            }
        };
        apiCall();
    }, [id, navigate])

    const DeleteTask = async (e, taskID) => {
        e.preventDefault();
        try {
            const response = await axios.delete(`${server}/delete/${taskID}`, {
                withCredentials: true,
            });
            navigate(`/tasks/${id}`)
            toast.success("task deleted successfully");
            setTasks(response.data.tasks)
        } catch (err) {
            toast.error(err.response.data.error);
        }
    }

    // const updateTask = async (e, taskID) => {
    //     e.preventDefault();
    //     try {
    //         await axios.put(`${server}/completed/${taskID}`, {
    //             withCredentials: true,
    //         });
    //         window.location.reload();
    //         setTimeout(() => {
    //             toast.success("task marked as completed");
    //         }, 2000)
    //     } catch (err) {
    //         console.log(err)
    //         toast.error(err.response.data.error);
    //         // navigate('/')
    //     }
    // }

    const updateTask = async (e, taskID) => {
        e.preventDefault();
        const newTask = "Hello";
        try {
            await axios.put(`${server}/completed/${taskID}`, newTask, {
                withCredentials: true,
            });
            navigate(`/tasks/${id}`)
            toast.success("task marked as completed");
        } catch (err) {
            toast.error(err.response.data.error);
            // navigate('/')
        }
    }


    return (<>
        {!loading ? <div>
            <Navbar id={id} />
            <div className='my-16 mx-16 rounded-2xl h-[600px] bg-gray-50'>
                <div className=' mx-4 h-[100%] py-3'>
                    {tasks?.map((task, index) => (
                        <div key={index} className='flex content-center h-[60px] justify-between items-center my-2 border-2 px-6 rounded-lg border-indigo-500 align-middle'>
                            <p className='text-indigo-500 font-semibold mb-0'>{task.title}</p>
                            <div className='flex w-4/12 justify-between'>
                                <Link
                                    to={`/tasks/added-tasks/edit/${task._id}`}
                                    className=' bg-blue-800 text-white py-2 px-4 rounded-lg no-underline'
                                >
                                    Edit
                                </Link>
                                <button
                                    className=' bg-red-800 text-white py-2 px-4 rounded-lg' onClick={(e) => { DeleteTask(e, task._id) }}
                                >
                                    Delete
                                </button>
                                {task.completed ? <button
                                    className=' bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600'
                                >
                                    Completed
                                </button> : <button
                                    className=' bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600' onClick={(e) => { updateTask(e, task._id) }}
                                >
                                    Mark as Completed
                                </button>}


                            </div>
                        </div>
                    ))}

                </div>
            </div>

        </div> : <p>Loading..</p>}</>
    )
}

export default AddedTasks