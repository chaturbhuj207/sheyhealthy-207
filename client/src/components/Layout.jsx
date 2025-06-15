import React, { useState } from 'react'
import '../layout.css';
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux';
import { Badge } from 'antd';
function Layout(props) {
    const { user } = useSelector((state) => state.user)
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false)
    const userMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-2-line'
        },
        {
            name: 'Appointments',
            path: '/appointments',
            icon: 'ri-file-list-line'
        },
        {
            name: 'Apply Doctor',
            path: '/apply-doctor',
            icon: 'ri-hospital-line'
        },

    ]
    const adminMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-2-line'
        },
        {
            name: 'Users',
            path: '/admin/userlist',
            icon: 'ri-group-line'
        },
        {
            name: 'Doctors',
            path: '/admin/doctorlist',
            icon: 'ri-stethoscope-line'
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: 'ri-shield-user-fill'
        },
    ]

    const doctorMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-2-line'
        },
        {
            name: 'Appointments',
            path: '/doctor/appointments',
            icon: 'ri-file-list-line'
        },
        {
            name: 'Profile',
            path: `/doctor/profile/${user?._id}`,
            icon: 'ri-shield-user-fill'
        },
    ]
    const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu
    const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User"

    return (
        <>
            <div className='main'>
                <div className='d-flex layout'>
                    <div className={`${collapsed ? 'collapsed-sidebar' : "sidebar"}`}>
                        <div className="sidebar-header">
                            <h1 className='logo'>Sh</h1>
                            <h1 className='role'>{role}</h1>
                        </div>
                        <div className="menu">
                            {menuToBeRendered.map((menu, index) => {
                                const isActive = location?.pathname === menu.path;
                                return (
                                    <div key={index} className={`d-flex menu-item ${isActive && "active-menu-item"}`}>
                                        {collapsed && <Link to={menu?.path} ><i className={menu?.icon}></i></Link>}
                                        {!collapsed && <i className={menu?.icon}></i>}
                                        {!collapsed && <Link to={menu?.path}>{menu?.name}</Link>}
                                    </div>
                                )
                            })}
                            <div className={`d-flex menu-item`} onClick={() => {
                                localStorage.clear(); window.location.href = "/";
                            }}>
                                {collapsed && <i className="ri-logout-box-line"></i>}
                                {!collapsed && <i className="ri-logout-box-line"></i>}
                                {!collapsed && <Link >Logout</Link>}
                            </div>
                        </div>
                    </div>
                    <div className='content'>
                        <div className='header'>
                            {collapsed ? <i onClick={() => setCollapsed(!collapsed)} className="ri-menu-2-line close-icon"></i> : <i onClick={() => setCollapsed(!collapsed)} className="ri-close-fill close-icon"></i>}
                            <div className='d-flex align-items-center px-4'>
                                <Badge count={user?.unseenNotifications.length} onClick={() => navigate('/notification')}>
                                    <i className="ri-notification-line close-icon"></i>
                                </Badge>
                                <Link to="/profile" className='anchor ms-3'>{user?.name?.split(' ')[0].toUpperCase()}</Link>
                            </div>
                        </div>
                        <div className='body'>{props.children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Layout