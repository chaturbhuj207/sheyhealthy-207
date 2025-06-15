import React from 'react'
import Layout from '../components/Layout'
import { Tabs } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { hideLoading, showLoading } from '../redux/alertsSlice'
import toast from 'react-hot-toast'
import axios from 'axios'
import { setUser } from '../redux/userSlice'

function Notification() {
    const { user } = useSelector((state) => state.user)
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const markAllNotification = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('api/user/mark-all-notifications-as-seen', { userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message)
                dispatch(setUser(response.data.data))
                navigate('/notification')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("error in sending data")
        }
    }
    const deleteAllNotification = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('api/user/delete-all-notifications', { userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message)
                dispatch(setUser(response.data.data))
                navigate('/notification')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("error in sending data")
        }
    }
    return (
        <>
            <Layout className='overflow-scroll'>
                <h1 className='page-title'>notifications</h1>
                <hr />

                <Tabs
                    items={[
                        {
                            key: '0',
                            label: 'unseen',
                            children: (
                                <>
                                    <div className='d-flex justify-content-end'>
                                        <h1 className='anchor' onClick={markAllNotification}>Mark all as seen</h1>
                                    </div>
                                    {user?.unseenNotifications.map((notification, index) => (
                                        <div className='card p-2 pointer mb-3' key={index} onClick={() => navigate(notification.onClickPath)}>
                                            <div className="card-text">{notification.message}</div>
                                        </div>
                                    ))}
                                </>
                            ),
                        },
                        {
                            key: '1',
                            label: 'seen',
                            children: (
                                <>
                                    <div className='d-flex justify-content-end'>
                                        <h1 className='anchor' onClick={deleteAllNotification}>Delete all</h1>
                                    </div>

                                    {user?.seenNotifications.map((notification, index) => (
                                        <div className='card p-2 pointer my-2 mb-3' key={index} onClick={() => navigate(notification.onClickPath)}>
                                            <div className="card-text py-1">{notification.message}</div>
                                        </div>
                                    ))}
                                </>
                            )
                        },
                    ]}
                />

            </Layout>
        </>
    )
}

export default Notification