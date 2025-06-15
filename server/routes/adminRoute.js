const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const USER = require("../models/userModel");
const DOCTOR = require('../models/doctorModel')

router.post("/get-all-doctors", authMiddleware, async (req, res) => {
    try {
        const doctors = await DOCTOR.find({})
        res.status(200).send({ message: "users fetched successfully", success: true, data: doctors });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "error fetching users", success: false })
    }
})
router.post("/get-all-users", authMiddleware, async (req, res) => {
    try {
        const users = await USER.find({})
        res.status(200).send({ message: "users fetched successfully", success: true, data: users });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "error fetching users", success: false })
    }
})
router.post("/change-doctor-status", authMiddleware, async (req, res) => {
    try {
        const { doctorId, status } = req.body
        const doctor = await DOCTOR.findByIdAndUpdate(doctorId, { status })

        const user = await USER.findOne({ _id: doctor.userId });
        const unseenNotifications = user.unseenNotifications;
        unseenNotifications.push({
            type: 'new-doctor-request-changed',
            message: `Your doctor account has been ${status}`,
            onClickPath: "/notification"
        });
        user.isDoctor = status === "approve" ? true : false
        await user.save();
        const doctors = await DOCTOR.find({});

        res.status(200).send({ message: "Doctor status updated successfully", success: true, data: doctors });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "error fetching users", success: false })
    }
})




module.exports = router;