import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/UserRegistration';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import { useSelector } from 'react-redux';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import ApplyDoctor from './pages/ApplyDoctor';
import Notification from './pages/Notification';
import Userlist from './pages/Admin/Userlist';
import Doctorlist from './pages/Admin/Doctorlist';
import Profile from './pages/Doctor/Profile';
import BookAppointment from './pages/BookAppointment';
import Appointments from './pages/Appointments';
import DoctorAppointments from './pages/Doctor/DoctorAppointment';
// import { Button } from 'antd'
function App() {
  const { loading } = useSelector(state => state.alerts)
  return (
    <BrowserRouter>{
      loading && (
        <div className="spinner-parent">
          <div className="spinner-border" role='status'></div>
        </div>)
    }
      <Toaster />
      <Routes>
        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/apply-doctor' element={<ProtectedRoute><ApplyDoctor /></ProtectedRoute>} />
        <Route path='/notification' element={<ProtectedRoute><Notification /></ProtectedRoute>} />
        <Route path='/admin/userlist' element={<ProtectedRoute><Userlist /></ProtectedRoute>} />
        <Route path='/admin/doctorlist' element={<ProtectedRoute><Doctorlist /></ProtectedRoute>} />
        <Route path='/doctor/profile/:userId' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/book-appointment/:doctorId' element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
        <Route path='/appointments' element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path='/doctor/appointments' element={<ProtectedRoute><DoctorAppointments /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}


export default App;
