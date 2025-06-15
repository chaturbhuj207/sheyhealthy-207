import { Button, Col, Form, Input, Row, TimePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React from 'react';

dayjs.extend(customParseFormat);

function DoctorForm({ onFinish, initivalValues }) {
    const formattedInitialValues = {
        ...initivalValues,
        ...(initivalValues?.timings && {
            timings: [
                dayjs(initivalValues.timings[0], "HH:mm"),
                dayjs(initivalValues.timings[1], "HH:mm"),
            ]
        }
        )
    };

    return (
        <>
            <Form layout='vertical' onFinish={onFinish} initialValues={formattedInitialValues}>
                <h1 className="card-title">Personal Information</h1>
                <Row gutter={20}>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="First Name" name="firstName" rules={[{ required: true }]}>
                            <Input placeholder="First Name" />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Last Name" name="lastName" rules={[{ required: true }]}>
                            <Input placeholder="Last Name" />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Phone Number" name="phoneNumber" rules={[{ required: true }]}>
                            <Input placeholder="Phone Number" />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="WebSite" name="webSite" rules={[{ required: true }]}>
                            <Input placeholder="WebSite" />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Address" name="address" rules={[{ required: true }]}>
                            <Input placeholder="Address" />
                        </Form.Item>
                    </Col>
                </Row>
                <hr />
                <h1 className="card-title">Professional Information</h1>
                <Row gutter={20}>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Specialization" name="specialization" rules={[{ required: true }]}>
                            <Input placeholder="Specialization" />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Experience" name="experience" rules={[{ required: true }]}>
                            <Input placeholder="Experience" />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Fee Per Consultation" name="feePerCunsultation" rules={[{ required: true }]}>
                            <Input placeholder="Fee Per Consultation" type='number' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Timings" name="timings" rules={[{ required: true }]}>
                            <TimePicker.RangePicker format="HH:mm" />
                        </Form.Item>
                    </Col>
                </Row>
                <div className="d-flex justify-content-end me-1">
                    <Button className='primary-button primary-btn' htmlType='submit'>SUBMIT</Button>
                </div>
            </Form>
        </>
    )
}

export default DoctorForm;
