import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import { Table } from 'antd';
import moment from 'moment';

function Userlist() {
    const api = process.env.REACT_APP_PROXY_URL;
    const [users, setUsers] = useState([])
    const dispatch = useDispatch();
    const getUsersData = async () => {
        try {
            dispatch(showLoading())
            const response = await axios.post(`${api}/api/admin/get-all-users`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            dispatch(hideLoading())
            if (response.data.success) {
                setUsers(response.data.data)
            }
        } catch (error) {

        }
    }
    const filterUsers = users.filter((user) => (!user.isAdmin && !user.isDoctor));


    useEffect(() => {
        getUsersData()
    }, [])

    const columns = [
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "Email",
            dataIndex: "email"
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
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => {
                return (

                    <div className='d-flex'>
                        <h1 className="anchor">Block</h1>
                    </div>
                )
            }
        },
    ]
    return (
        <>
            <Layout>
                <h1 className='page-title '>User List</h1>
                <hr />
                <Table rowKey="_id" columns={columns} dataSource={filterUsers} />
            </Layout>
        </>
    )
}

export default Userlist