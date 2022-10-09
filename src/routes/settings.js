const express = require('express');
const requireAuth = require('../middlewares/requireauth.js');
const mongoose = require('mongoose');
const Settings = mongoose.model('Settings');

const router = express.Router();

router.use(requireAuth)

router.post('/settings' , async (req, res) => {
    const { theme, emailSubscriptions, notifications } = req.body;
    try {
        const settings = await Settings.find({userId:req.user._id});
        if(settings.length === 0){
            const setting = new Settings({
                theme,
                emailSubscriptions,
                notifications,
                userId:req.user._id
            })
            try {
                await setting.save();
                res.status(201).send(setting);
            } catch (error) {
                res.status(500).send({ message: error.message });
            }
        }
        else{
            res.status(400).send({ message: `Setting is already exits` });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.put('/settings/:id' ,async (req, res) => {
    const { theme, emailSubscriptions, notifications } = req.body;
    try {
        const setting = await Settings.findById(req.params.id);
        if (String(setting.userId) === String(req.user._id)) {
            setting.theme = theme;
            setting.emailSubscriptions = emailSubscriptions;
            setting.notifications = notifications;
            const updatedSetting = await setting.save();
            res.status(201).json(updatedSetting);
        }
        else {
            throw new Error(`Same user only allows to modify the setting`);
        }
    } catch (error) {
        res.status(402).send({ message: 'Settings is not found with this id ::' + req.params.id })
    }
})

router.get('/settings/:id',async(req,res)=>{
	try {
		const setting = await Settings.findById(req.params.id);
		res.status(200).json({setting})
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})


router.get('/settings', async (req, res) => {
    try {
        const settings = await Settings.find();
        res.status(201).send({settings,totalCount:settings.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/settings/:pageIndex/:pageSize', async (req, res) => {
    try {
        const { pageIndex,pageSize }= req.params;
		const allSettings = await Settings.find({});
		const settings = await Settings.find({}).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
        res.status(201).send({settings,totalCount:allSettings.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})



module.exports = router;