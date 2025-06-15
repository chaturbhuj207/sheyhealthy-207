import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import Doctor from '../components/Doctor'
import { Col, Row } from 'antd'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../redux/alertsSlice'

function Home() {
  const api = process.env.REACT_APP_PROXY_URL;

  const [doctor, setDoctor] = useState([])
  const dispatch = useDispatch()

  const getdata = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.post(`${api}/api/user/get-all-approved-doctors`, {}, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      })
      dispatch(hideLoading())
      if (response.data?.success) {
        setDoctor(response.data?.data)
      }
    } catch (error) {
      dispatch(hideLoading())
    }
  }

  useEffect(() => {
    getdata();
  }, [])

  return (
    <Layout>
      <h1 className='page-title'>All Doctors </h1>
      <hr />
      {doctor.length > 0 ? <Row gutter={20}>
        {doctor.map((doctor) => (
          <Col span={8} xs={24} sm={24} lg={8} key={doctor?._id} >
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row> : <h1 className='text-center'>No Doctors Available</h1>}
    </Layout>
  )
}

export default Home