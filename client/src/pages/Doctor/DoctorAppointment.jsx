import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import { Table } from 'antd';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

function DoctorAppointments() {
    const api = process.env.REACT_APP_PROXY_URL;

    const [doctorAppointments, setDoctorAppointments] = useState([])
    const dispatch = useDispatch();
    const getAppointmentData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.post(`${api}/api/doctor/get-appointment-by-doctor-id`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                setDoctorAppointments(response?.data?.data)
            }
        } catch (error) {

        }
    }

    const changeAppointmentStatus = async (record, status) => {
        try {
            dispatch(showLoading())
            const response = await axios.post(`${api}/api/doctor/change-appointment-status`, { appointmentId: record._id, status: status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message)
                getAppointmentData()
            }
        } catch (error) {
            toast.error(error)
        }
    }
    useEffect(() => {
        getAppointmentData()
    }, [])


    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
        },
        {
            title: "Patient",
            dataIndex: "name",
            render: (text, record) => {
                return (
                    <span>
                        {record.userInfo.name}
                    </span>
                )
            }

        },
        {
            title: "Phone Number",
            dataIndex: "phoneNumber",
            render: (text, record) => {
                return (

                    <span>
                        {record.doctorInfo.phoneNumber}
                    </span>
                )
            }
        },
        {
            title: "Date and Time",
            dataIndex: "date",
            render: (text, record) => {
                return (<span>
                    {dayjs(record.date).format("DD-MM-YYYY")} {dayjs(record.time).format("HH:mm")}
                </span>)
            }
        }, {
            title: "Status",
            dataIndex: "status",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => {
                return (
                    <div className='d-flex'>
                        {record.status === "pending" && (
                            <div className='d-flex'>
                                <h1 className='anchor px-2' onClick={() => changeAppointmentStatus(record, 'approve')}>Approve </h1>
                                <h1 className='anchor' onClick={() => changeAppointmentStatus(record, 'rejected')}> Reject</h1>
                            </div>)}
                    </div>
                )
            }

        },
    ]
    return (
        <Layout>
            <h1 className='page-title '>Appointments</h1>
            <Table rowKey="_id" columns={columns} dataSource={doctorAppointments} />
        </Layout>)
}

export default DoctorAppointments