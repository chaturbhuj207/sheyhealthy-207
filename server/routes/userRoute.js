const express = require('express');
const router = express.Router();
const USER = require("../models/userModel");
const DOCTOR = require('../models/doctorModel');
const APPOINTMENT = require('../models/appointmentModel');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const moment = require('moment');
const authMiddleware = require('../middlewares/authMiddleware');
const dayjs = require('dayjs');

const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);


router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const userExists = await USER.findOne({ email });
        if (userExists) {
            res.send({ message: "user is exist", success: false });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt)

        const userdata = new USER({ name: name, email: email, password: hashedpassword })
        await userdata.save();
        console.log("user ", userdata)

        res.status(200).send({ message: "user Register successfully", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "error creating user", success: false, error })
    }
})
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await USER.findOne({ email: email })
        if (!user) {
            res.status(200).send({ message: "User does not exist", success: false });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(200).send({ message: "Password is incorrect ", success: false });
            return;
        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
            res.status(200).send({ message: "Login is successful", success: true, data: token });
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error in logging in ", success: false, error })
    }
})
router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
    try {
        const user = await USER.findOne({ _id: req.body.userId })
        user.password = ""
        if (!user) {
            return res.status(200).send({ message: "User is not exist", success: false })
        } else {
            res.status(200).send({
                success: true,
                data: user
            })
        }

    } catch (error) {
        res.status(500).send({ message: "Error getting user Info", success: false, error })
    }
})
router.post('/apply-doctor-account', authMiddleware, async (req, res) => {
    try {

        const newDoctor = new DOCTOR({ ...req.body, status: "pending" })
        await newDoctor.save();
        const adminUser = await USER.findOne({ isAdmin: true });
        const unseenNotifications = adminUser.unseenNotifications;
        unseenNotifications.push({
            Type: "new-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName
            },
            onClickPath: "/admin/doctorlist"
        })
        await USER.findByIdAndUpdate(adminUser._id, { unseenNotifications })
        res.status(200).send({ message: "Doctor account applied successfully", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "error Applying doctor account", success: false, error })
    }
})
router.post('/mark-all-notifications-as-seen', authMiddleware, async (req, res) => {
    try {

        const user = await USER.findOne({ _id: req.body.userId });
        const unseenNotifications = user.unseenNotifications;
        const seenNotifications = user.seenNotifications;
        seenNotifications.push(...unseenNotifications)
        user.unseenNotifications = [];
        const upDatedUser = await user.save();
        upDatedUser.password = undefined;
        res.status(200).send({ message: "All Notifications marked as seen", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "error Applying doctor account", success: false, error })
    }
})
router.post('/delete-all-notifications', authMiddleware, async (req, res) => {
    try {

        const user = await USER.findOne({ _id: req.body.userId });
        user.seenNotifications = [];
        user.unseenNotifications = [];
        const upDatedUser = await user.save();
        upDatedUser.password = undefined;
        res.status(200).send({ message: "Deleted all Notifications ", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "error Applying doctor account", success: false, error })
    }
})
router.post('/get-all-approved-doctors', authMiddleware, async (req, res) => {
    try {
        const doctor = await DOCTOR.find({ status: 'approve' })
        res.status(200).send({ message: "Doctors fetched successfully", success: true, data: doctor })
    } catch (error) {
        res.status(500).send({ message: "Error getting user Info", success: false, error })
    }
})
router.post('/book-appointment', authMiddleware, async (req, res) => {
    try {
        req.body.status = "pending";

        const { date, time } = req.body;
        const appointmentDateTime = moment(`${date} ${time}`, "DD-MM-YYYY HH:mm");

        if (!appointmentDateTime.isValid()) {
            return res.status(400).send({ message: "Invalid date or time format", success: false });
        }

        req.body.date = appointmentDateTime.toISOString(); // full ISO timestamp
        req.body.time = appointmentDateTime.toISOString(); // full ISO timestamp

        const newAppointment = new APPOINTMENT(req.body);
        await newAppointment.save();

        const user = await USER.findOne({ _id: req.body.doctorInfo.userId });
        user.unseenNotifications.push({
            type: "new-appointment-request",
            message: `You have a new appointment request from ${req.body.userInfo.name}`,
            onClickPath: "/doctor/appointments"
        });
        await user.save();

        res.status(200).send({ message: "Appointment booked successfully", success: true });
    } catch (error) {
        console.log("❌ Book Appointment Error:", error);
        res.status(500).send({
            message: "Error booking appointment",
            success: false,
            error: error.message || error
        });
    }
});
router.post('/check-booking-availability', authMiddleware, async (req, res) => {
    try {
        // Combine date and time to get full ISO time
        const appointmentDateTime = moment(`${req.body.date} ${req.body.time}`, "DD-MM-YYYY HH:mm");

        if (!appointmentDateTime.isValid()) {
            return res.status(400).send({ message: "Invalid date or time", success: false });
        }

        const fromTime = moment(appointmentDateTime).subtract(1, "hours").toISOString();
        const toTime = moment(appointmentDateTime).add(1, "hours").toISOString();

        const appointments = await APPOINTMENT.find({
            doctorId: req.body.doctorId,
            time: {
                $gte: fromTime,
                $lte: toTime
            }
        });

        if (appointments.length > 0) {
            return res.status(200).send({
                message: "Appointment not available at this time",
                success: false
            });
        }

        return res.status(200).send({
            message: "Appointment available",
            success: true
        });

    } catch (error) {
        console.log("Check Booking Availability Error:", error);
        res.status(500).send({
            message: "Error checking availability",
            success: false,
            error: error.message || error
        });
    }
});
router.post('/get-appointment-by-user-id', authMiddleware, async (req, res) => {
    try {
        const appointment = await APPOINTMENT.find({ userId: req.body.userId });
        res.status(200).send({ message: "Appointments fetched successfully", success: true, data: appointment })
    } catch (error) {
        res.status(500).send({ message: "Error Appointment  Info", success: false, error })
    }
})


module.exports = router;