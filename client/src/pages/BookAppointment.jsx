import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { hideLoading, showLoading } from '../redux/alertsSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { DatePicker, TimePicker } from 'antd';
import toast from 'react-hot-toast';

function BookAppointment() {
    const api = process.env.REACT_APP_PROXY_URL;

    const [isAvailable, setIsAvailable] = useState(false)
    const [doctor, setDoctor] = useState(null)
    const { user } = useSelector((state) => state.user);
    const [date, setDate] = useState()
    const [time, setTime] = useState()
    const params = useParams()
    const navigate = useNavigate()
    // console.log(params.doctorId)
    const dispatch = useDispatch();

    const getDoctorData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post("/api/doctor/get-doctor-info-by-id", { doctorId: params.doctorId }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                setDoctor(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
        }
    };

    const checkAvailability = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post(`${api}/api/user/check-booking-availability`, {
                doctorId: params.doctorId,
                date: date,
                time: time,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                setIsAvailable(true);
            } else {
                toast.error(response.data.message);
            }
        }
        catch (error) {
            toast.error("Error booking appointment ")
            dispatch(hideLoading());
        }
    }
    const bookNow = async () => {
        try {
            setIsAvailable(false);
            dispatch(showLoading());
            const response = await axios.post(`${api}/api/user/book-appointment`, {
                doctorId: params.doctorId,
                userId: user._id,
                date: date,
                time: time,
                doctorInfo: doctor,
                userInfo: user
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/appointments");
            }
        } catch (error) {
            toast.error("Error booking appointment ")
            dispatch(hideLoading());
        }
    }
    useEffect(() => {
        getDoctorData();
    }, []);
    return (

        <Layout>{
            doctor && (
                <div>

                    <h1 className="card-title mb-0">{doctor?.firstName} {doctor?.lastName}</h1>
                    <hr />
                    <h1 className='normal-text'><b>Timings : </b>{doctor?.timings[0]} - {doctor?.timings[1]}</h1>

                    <div className='d-flex'>
                        <div className='d-flex flex-column w-25 mt-3 me-5'>
                            <DatePicker format="DD-MM-YYYY" onChange={(value) => { setIsAvailable(false); setDate(dayjs(value).format("DD-MM-YYYY")) }} />
                            <TimePicker format="HH:mm" className='mt-3' onChange={(value) => { setIsAvailable(false); setTime(dayjs(value).format("HH:mm")) }} />
                            {
                                !isAvailable ?
                                    <button className='primary-button mt-3 border-0 rounded-1' onClick={checkAvailability}>Check Availability</button> :
                                    <button className='primary-button mt-3 border-0 rounded-1' onClick={bookNow}>Book Now</button>}
                        </div>
                        <div className='m-3 ms-5 border p-3 rounded'>
                            <p className='card-text m-0 ps-1'><b>Phone Number : </b> {doctor?.phoneNumber}</p>
                            <p className='card-text m-0 mt-1 ps-1'><b>Address : </b> {doctor?.address}</p>
                            <p className='card-text m-0 mt-1 ps-1'><b>fee per visit : </b> {doctor?.feePerCunsultation}</p>
                            <p className='card-text m-0 mt-1 ps-1'><b>specialization : </b> {doctor?.specialization}</p>
                            <p className='card-text m-0 mt-1 ps-1'><b>experience : </b> {doctor?.experience}</p>

                        </div>
                    </div>
                </div>
            )}
        </Layout>)
}

export default BookAppointment