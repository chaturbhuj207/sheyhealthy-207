import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { Table } from 'antd';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

function Appointments() {
    const [appointments, setAppointments] = useState([])
    const dispatch = useDispatch();
    const getAppointmentData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/user/get-appointment-by-user-id ', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                setAppointments(response?.data?.data)
            }
        } catch (error) {

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
            title: "Doctor Name",
            dataIndex: "name",
            render: (text, record) => {
                return (
                    <span>
                        {record.doctorInfo?.firstName} {record.doctorInfo?.lastName}
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
               return( <span>
                    {dayjs(record.date).format("DD-MM-YYYY")} {dayjs(record.time).format("HH:mm")}
                </span>)
            }
        },
        {
            title: "Status",
            dataIndex: "status"
        },
    ]
    return (
        <Layout>
            <h1 className='page-title '>Appointments</h1>
            <hr />

            <Table rowKey="_id" columns={columns} dataSource={appointments} />
        </Layout>)
}

export default Appointments