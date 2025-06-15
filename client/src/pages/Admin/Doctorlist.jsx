import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import { Table } from 'antd';
import toast from 'react-hot-toast';
import moment from 'moment';

function Doctorlist() {
    const api = process.env.REACT_APP_PROXY_URL;
    const [doctors, setDoctors] = useState([])
    const dispatch = useDispatch();
    const getDoctorData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.post(`${api}/api/admin/get-all-doctors`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                setDoctors(response?.data?.data)
            }
        } catch (error) {

        }
    }
    const changeDoctorStatus = async (record, status) => {
        try {
            dispatch(showLoading())
            const response = await axios.post(`${api}/api/admin/change-doctor-status`, { doctorId: record._id, userId: record.userId, status: status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message)
                getDoctorData()

            }
        } catch (error) {
            toast.error(error)
        }
    }
    useEffect(() => {
        getDoctorData()
    }, [])
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            render: (text, record) => {
                return (

                    <h1 className="anchor">{record.firstName} {record.lastName}</h1>

                )
            }
        },
        {
            title: "Phone",
            dataIndex: "phoneNumber"
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            render: (text, record) => {
                return (
                    <span>{moment(record.createdAt).format("DD-MM-YYYY")}</span>
                )
            }
        },
        {
            title: "Status",
            dataIndex: "status"
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => {
                return (
                    <div className='d-flex'>
                        {record.status === "pending" && <h1 className='anchor' onClick={() => changeDoctorStatus(record, 'approve')}>Approve</h1>}
                        {record.status === "approve" && <h1 className='anchor' onClick={() => changeDoctorStatus(record, 'blocked')}>Block</h1>}
                    </div>
                )
            }

        },
    ]
    return (
        <>
            <Layout>
                <h1 className='page-title '>Doctor List</h1>
                <hr />
                <Table rowKey="_id" columns={columns} dataSource={doctors} />
            </Layout>
        </>
    )
}

export default Doctorlist