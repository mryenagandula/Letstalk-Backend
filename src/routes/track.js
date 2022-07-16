const express = require('express');

const requireAuth = require('../middlewares/requireauth.js');

const mongoose = require('mongoose');

const Track = mongoose.model('Track');

const router = express.Router();

router.use(requireAuth);

router.get('/tracks',async (req, res)=>{
	const tracks = await Track.find({userId: req.user._id});
	res.status(200).send({tracks})
})

router.get('/tracks/all',async (req, res)=>{
	const tracks = await Track.find();
	res.status(200).send({tracks})
})

router.get('/tracks/all/:pageIndex/:pageSize',async(req,res)=>{
	try {
		const {pageIndex,pageSize}= req.params;
		const allTracks = await Track.find();
		const tracks = await Track.find({}).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
		res.status(200).json({tracks, totalCount: allTracks.length})
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})

router.get('/tracks/all/:pageIndex/:pageSize/:user_id',async(req,res)=>{
	try {
		const {pageIndex,pageSize}= req.params;
		const allTracks = await Track.find({userId: req.params.user_id});
		const tracks = await Track.find({userId: req.params.user_id}).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
		res.status(200).json({tracks, totalCount: allTracks.length})
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})

router.get('/tracks/:id',async (req, res)=>{
	const tracks = await Track.find({userId: req.user._id,_id:req.params.id});
	res.status(200).send({tracks})
})

router.post('/tracks',async(req, res)=>{
	const {name ,locations} = req.body;
	
	if(!name || !locations){
		return res.status(402).send({"message": "name and locations must be specified"});
	}
	const track = new Track({
		name,locations,userId:req.user._id
	})

	try{
		await track.save();
		res.status(201).send({track})
	}
	catch(err){
		res.status(422).send({message: err.message});
	}
})

module.exports =router;