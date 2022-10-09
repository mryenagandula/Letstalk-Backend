const express = require('express');
const requireAuth = require('../middlewares/requireauth.js');
const mongoose = require('mongoose');
const Comment = mongoose.model('Comment');
const Blog = mongoose.model('Blog');


const router = express.Router();

router.use(requireAuth)

router.get('/comments/userId/:pageIndex/:pageSize', async (req, res) => {
    try {
        const {pageIndex,pageSize}= req.params;
		const allComments = await Comment.find({userId:req.user._id});
		const comments = await Comment.find({userId:req.user._id}).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
        res.status(201).send({comments,totalCount:allComments.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/comments/userId', async (req, res) => {
    try {
        const comments = await Comment.find({userId:req.user._id});
        res.status(201).send({comments,totalCount:comments.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.post('/comments' , async (req, res) => {
    const { text,blogId } = req.body;
    try {
        const comment = new Comment({
            text,userId:req.user._id,blogId
        })
        try {
            await comment.save();
            const blog = await Blog.findById(blogId);
            blog.comments = [...blog.comments,comment._id];
            blog.save();
            res.status(201).send(comment);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.put('/comments/:id' ,async (req, res) => {
    const { description,text } = req.body;
    try {
        const comment = await Comment.findById(req.params.id);
        if (String(comment.userId) === String(req.user._id)) {
            comment.text = text;
            const updateComment = await comment.save();
            res.status(201).json(updateComment);
        }
        else{
            throw new Error(`Same user only allows to modify the comment`);
        }
    } catch (error) {
        res.status(402).send({ message: 'Comment is not found with this id ::' + req.params.id })
    }
})

router.get('/comments/:id',async(req,res)=>{
	try {
		const comment = await Comment.findById(req.params.id);
		res.status(200).json({comment})
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})


router.get('/comments', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(201).send({comments,totalCount:comments.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/comments/:blogId', async (req, res) => {
    try {
        const comments = await Comment.find({blogId});
        res.status(201).send({comments,totalCount:comments.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/comments/:userId/:blogId', async (req, res) => {
    try {
        const comments = await Comment.find({userId,blogId});
        res.status(201).send({comments,totalCount:comments.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/comments/:pageIndex/:pageSize', async (req, res) => {
    try {
        const {pageIndex,pageSize}= req.params;
		const allComments = await Comment.find({});
		const comments = await Comment.find({}).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
        res.status(201).send({comments,totalCount:allComments.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})



module.exports = router;