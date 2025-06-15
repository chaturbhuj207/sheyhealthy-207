import { Button, Form, Input } from 'antd'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';



function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/user/register', values)
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message)
                navigate('/login')
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
            <div className='authentication'>
                <div className='authentication-form card p-2'>
                    <h1 className='card-title mt-1'>Nice To Meet U</h1>
                    <Form layout='vertical' onFinish={onFinish}>
                        <Form.Item label='Name' name='name'>
                            <Input placeholder='Name' onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} />
                        </Form.Item>

                        <Form.Item label='Email' name='email'>
                            <Input placeholder='Email' onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} />
                        </Form.Item>

                        <Form.Item label='Password' name='password'>
                            <Input placeholder='Pasword' type='password' />
                        </Form.Item>
                        <Button className='primary-button my-2' htmlType='submit'>REGISTER</Button>
                        <Link to='/login' className='anchor'>CLICK HERE TO LOGIN</Link>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default Register