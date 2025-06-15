import React from 'react'
import Layout from '../components/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoading, showLoading } from '../redux/alertsSlice'
import axios from 'axios'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import DoctorForm from '../components/DoctorForm'

function ApplyDoctor() {
    const api = process.env.REACT_APP_PROXY_URL;

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            const response = await axios.post(`${api}/api/user/apply-doctor-account`, {
                ...values,
                userId: user._id,
                timings: [
                    dayjs(values.timings[0]).format("HH:mm"),
                    dayjs(values.timings[1]).format("HH:mm"),
                ],
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message)
                navigate('/')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("Error in sending data")
        }
    }

    return (
        <Layout>
            <h1 className='page-title ms-2'><i className="ri-article-line"> </i> Apply Doctor Account</h1>
            <hr />
            <DoctorForm onFinish={onFinish} />
        </Layout>
    )
}

export default ApplyDoctor
