import { Link } from "react-router-dom";

const Navbar = ({ id }) => (
    <div className='bg-gray-50 py-6 flex justify-between lg:px-16 px-4'>
        <h3 className=' text-indigo-500 font-bold text-lg '>
            <Link to={`/tasks/${id}`} className="no-underline text-indigo-500">Task Management App</Link>
        </h3>
        <nav className="flex lg:w-2/12 justify-between">
            <Link className="text-indigo-500 font-semibold no-underline hover:border-b-2 hover:border-indigo-500" to={`/tasks/added-tasks/${id}`}>Added Tasks</Link>
        </nav>
    </div>
);

export default Navbar;