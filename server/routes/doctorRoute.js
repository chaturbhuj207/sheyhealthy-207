const express = require('express');
const router = express.Router();
const USER = require("../models/userModel");
const DOCTOR = require('../models/doctorModel')
const authMiddleware = require('../middlewares/authMiddleware');
const APPOINTMENT = require('../models/appointmentModel');


router.post("/get-doctor-info-by-id", authMiddleware, async (req, res) => {
    try {
        const doctor = await DOCTOR.findOne({ _id: req.body.doctorId });
        res.status(200).send({ message: "Doctor info fetched    ", success: true, data: doctor });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "error getting doctor info", success: false })
    }
})
router.post("/get-doctor-info-by-userId", authMiddleware, async (req, res) => {
    try {
        const doctor = await DOCTOR.findOne({ userId: req.body.userId });
        res.status(200).send({ message: "Doctor info fetched    ", success: true, data: doctor });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "error getting doctor info", success: false })
    }
})
router.post("/update-doctor-profile", authMiddleware, async (req, res) => {
    try {
        const doctor = await DOCTOR.findOneAndUpdate({ userId: req.body.userId }, req.body);
        res.status(200).send({ message: "Doctor Profile updated successfully", success: true, data: doctor });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "error getting doctor info", success: false })
    }
})
router.post('/get-appointment-by-doctor-id', authMiddleware, async (req, res) => {
    try {
        const doctor = await DOCTOR.findOne({ userId: req.body?.userId });
        const appointment = await APPOINTMENT.find({ doctorId: doctor?._id });
        res.status(200).send({ message: "Appointments fetched successfully", success: true, data: appointment })
    } catch (error) {
        res.status(500).send({ message: "Error Appointment  Info", success: false, error })
    }
})

router.post("/change-appointment-status", authMiddleware, async (req, res) => {
    try {
        const { appointmentId, status } = req.body
        const appointment = await APPOINTMENT.findByIdAndUpdate(appointmentId, { status })

        const user = await USER.findOne({ _id: appointment.userId });
        const unseenNotifications = user.unseenNotifications;
        unseenNotifications.push({
            type: 'appointment request changed',
            message: `Your appointment request has been ${status}`,
            onClickPath: "/appointments"
        });
        await user.save();
        res.status(200).send({ message: "Appointment status updated successfully", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "error fetching appointments status", success: false })
    }
})

module.exports = router;