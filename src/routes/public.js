const express = require('express');
const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');
const Audit = mongoose.model('Audit');

const router = express.Router();

router.get('/public/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(201).send({blogs,totalCount:blogs.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/public/blogs/:pageIndex/:pageSize/:published', async (req, res) => {
    try {
        const {pageIndex,pageSize,published}= req.params;
		const allBlogs = await Blog.find({published});
		const blogs = await Blog.find({published}).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
        res.status(201).send({blogs,totalCount:allBlogs.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/public/audits/:pageIndex/:pageSize',async(req,res)=>{
    try {
        const filter= {}
        const queryParams = req?.query;
        if(req?.query){
            if(queryParams.email){
                filter.email = queryParams.email === 'no-email' ? null : queryParams.email
            }
            if(queryParams.statusCode){
                filter.statusCode = queryParams.statusCode
            }
            if(queryParams.statusMessage){
                filter.statusMessage = queryParams.statusMessage
            }
        }
		const {pageIndex,pageSize}= req.params;
		const allAudits = await Audit.find(filter);
		const audits = await Audit.find(filter).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
		res.status(200).json({audits, totalCount: allAudits.length})
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})

router.get('/public/audits/filter-values',async(req,res)=>{
    try {
		const  statusCodes= await Audit.find({},{ statusCode:1,_id:0 })
        const  statusMessages= await Audit.find({},{ statusMessage: 1,_id:0 })
        const  emails= await Audit.find({},{ email:1,_id:0 })
		res.status(200).json({
            statusCodes: [...new Set(statusCodes.map(item=> item.statusCode))],
            statusMessages: [...new Set(statusMessages.map(item=> item.statusMessage))],
            emails: [...new Set(emails.map(item=> item.email))],
        })
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})

module.exports = router;