import { Navigate , Outlet } from "react-router-dom";

const ProtectedRoute = ({ roleRequired }) => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token) return <Navigate to='/login' />;
    if (roleRequired && role !== roleRequired) return <Navigate to='/' />;

    return <Outlet/>

}

export default ProtectedRoute