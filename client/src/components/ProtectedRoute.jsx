import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setUser } from '../redux/userSlice'
import { hideLoading, showLoading } from '../redux/alertsSlice'
function ProtectedRoute(props) {
    const api = process.env.REACT_APP_PROXY_URL;
    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getdata = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.post(`${api}/api/user/get-user-info-by-id`, { token: localStorage.getItem("token") }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                dispatch(setUser(response.data.data))
            } else {
                localStorage.clear()
                navigate('/login');
            }
        } catch (error) {
            dispatch(hideLoading())
            localStorage.clear()
            navigate('/login')

        }
    }
    useEffect(() => {
        if (!user) {
            getdata();
        }
    }, [user])

    if (localStorage.getItem("token")) {
        return props.children
    } else {
        return <Navigate to="login" />
    }
}

export default ProtectedRoute