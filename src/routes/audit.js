const express = require('express');

const requireAuth = require('../middlewares/requireauth.js');

const adminauth = require('../middlewares/adminauth');

const mongoose = require('mongoose');

const Audit = mongoose.model('Audit');

const router = express.Router();

router.get('/audits',[requireAuth,adminauth],async (req, res)=>{
    try {
        const audits = await Audit.find({});
        res.status(200).send({audits})
    } catch (error) {
        console.log(error.message);
		res.status(500).send({message:error.message});
    }
})

router.get('/audits/:email',[requireAuth,adminauth],async (req, res)=>{
    try {
        const audits = await Audit.find({email: req.params.email});
        res.status(200).send({audits})
    } catch (error) {
        console.log(error.message);
		res.status(500).send({message:error.message});
    }
})

router.get('/audits/:pageIndex/:pageSize',[requireAuth,adminauth],async(req,res)=>{
	try {
		const {pageIndex,pageSize}= req.params;
		const allAudits = await Audit.find();
		const audits = await Audit.find({}).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
		res.status(200).json({audits, totalCount: allAudits.length})
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})

router.get('/audits/:email/:pageIndex/:pageSize',[requireAuth,adminauth],async(req,res)=>{
	try {
		const {email,pageIndex,pageSize}= req.params;
		const allAudits = await Audit.find({email});
		const audits = await Audit.find({email}).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
		res.status(200).json({audits, totalCount: allAudits.length})
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})

module.exports =router;