import React from 'react'
import { useNavigate } from 'react-router-dom'

function Doctor({ doctor }) {
    const navigate = useNavigate()
    return (
        <div className='card p-3 pt-2' onClick={() => navigate(`/book-appointment/${doctor?._id}`)}>
            <h1 className="card-title mb-0">{doctor?.firstName} {doctor?.lastName}</h1>
            <hr className='my-2' />
            <p className='card-text m-0 ps-1'><b>Phone Number : </b> {doctor?.phoneNumber}</p>
            <p className='card-text m-0 mt-1 ps-1'><b>specialization : </b> {doctor?.specialization}</p>
            <p className='card-text m-0 mt-1 ps-1'><b>fee per visit : </b> {doctor?.feePerCunsultation}</p>
            <p className='card-text m-0 mt-1 ps-1'><b>Address : </b> {doctor?.address}</p>
            <p className='card-text m-0 mt-1 ps-1'><b>experience : </b> {doctor?.experience}</p>
            <p className='card-text m-0 mt-1 ps-1'><b>Timings : </b> {doctor?.timings[0]} - {doctor?.timings[1]}</p>
        </div>
    )
}

export default Doctor