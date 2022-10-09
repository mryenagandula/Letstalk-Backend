const express = require('express');
const requireAuth = require('../middlewares/requireauth.js');
const mongoose = require('mongoose');
const Notifications = mongoose.model('Notifications');

const router = express.Router();

router.use(requireAuth)

router.get('/notifications/userId/:pageIndex/:pageSize', async (req, res) => {
    try {
        const {pageIndex,pageSize}= req.params;
		const allNotifications = await Notifications.find({userId:req.user._id});
		const notifications = await Notifications.find({userId:req.user._id}).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
        res.status(201).send({notifications,totalCount:allNotifications.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/notifications/userId', async (req, res) => {
    try {
        const notifications = await Notifications.find({userId:req.user._id});
        res.status(201).send({notifications,totalCount:notifications.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.post('/notifications' , async (req, res) => {
    const { 
        title ,
        description,
        refType,
        refId
    } = req.body;
    try {
        const notification = new Notifications({
            title,
            description,
            refType,
            refId,
            userId:req.user._id
        })
        try {
            await notification.save();
            res.status(201).send(notification);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.put('/notifications/:id' ,async (req, res) => {
    const { description,title } = req.body;
    try {
        const notification = await Notifications.findById(req.params.id);
        if (String(notification.userId) === String(req.user._id)) {
            notification.title = title;
            notification.description = description;
            notification.refType = refType;
            notification.refId = refId;
            const updatedNotification = await notification.save();
            res.status(201).json(updatedNotification);
        }
        else {
            throw new Error(`Same user only allows to modify the notification`);
        }
    } catch (error) {
        res.status(402).send({ message: 'Notifications is not found with this id ::' + req.params.id })
    }
})

router.get('/notifications/:id',async(req,res)=>{
	try {
		const notification = await Notifications.findById(req.params.id);
		res.status(200).json({notification})
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})


router.get('/notifications', async (req, res) => {
    try {
        const notifications = await Notifications.find();
        res.status(201).send({notifications,totalCount:notifications.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/notifications/:pageIndex/:pageSize', async (req, res) => {
    try {
        const {pageIndex,pageSize}= req.params;
		const allNotifications = await Notifications.find({});
		const notifications = await Notifications.find({}).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
        res.status(201).send({notifications,totalCount:allNotifications.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})



module.exports = router;