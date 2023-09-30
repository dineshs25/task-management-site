import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import TaskPage from './pages/taskPage';
import { ToastContainer } from 'react-toastify';
import AddedTasks from './components/addedTasks';
import EditTasks from './components/editTasks';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Routes>
          <Route path='/' exact element={<Login />} />
          <Route path="/tasks/:id" exact element={
            <TaskPage />
          } />
          <Route path="/tasks/added-tasks/:id" exact element={
            <AddedTasks />
          } />
          <Route path="/tasks/added-tasks/edit/:id" exact element={
            <EditTasks />
          } />
          <Route path='/register' exact element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
