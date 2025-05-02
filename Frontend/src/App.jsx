import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './Pages/User/Signup';
import { store } from './Redux/store';
import Home from  './Pages/User/Home'
import Login from './Pages/User/Login ';
import ProtectedRoute from './Component/ProtectedRoute';
import AdminLogin from './Pages/Admin/AdminLogin';
import AdminDashboard from './Pages/Admin/AdminDashboard'
import AddUser from './Pages/Admin/Adduser';
import ProtectedRouteadmin from './Component/ProtectedRouteadmin';
import './App.css';

function App() {
  return (
    <Provider store={store}> 
      <Router>
        <Routes>
        <Route path="/" element={<Login/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>} />   
          <Route path='adminlogin' element={<AdminLogin/>}/> 
          <Route path="/dashboard" element={<ProtectedRouteadmin><AdminDashboard /></ProtectedRouteadmin>} />
          <Route path="/admin/add-user" element={<AddUser />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
