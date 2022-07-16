const express = require('express');
const requireAuth = require('../middlewares/requireauth.js');
const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');

const router = express.Router();

router.use(requireAuth)

router.get('/blogs/userId/:pageIndex/:pageSize/:published', async (req, res) => {
    try {
        const {pageIndex,pageSize,published}= req.params;
		const allBlogs = await Blog.find({userId:req.user._id,published});
		const blogs = await Blog.find({userId:req.user._id,published}).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
        res.status(201).send({blogs,totalCount:allBlogs.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/blogs/userId', async (req, res) => {
    try {
        const blogs = await Blog.find({userId:req.user._id});
        res.status(201).send({blogs,totalCount:blogs.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.post('/blogs' , async (req, res) => {
    const { description,title,featureImageUri,comments,categories,tags } = req.body;
    const blog = new Blog({
        description, title, featureImageUri, userId:req.user._id,
        comments,categories,tags
    })
    try {
        await blog.save();
        res.status(201).send(blog);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.put('/blogs/:id' ,async (req, res) => {
    const { description,title,featureImageUri } = req.body;
    try {
        const blog = await Blog.findById(req.params.id);
        blog.title = title;
        blog.description = description;
        blog.featureImageUri = featureImageUri;
        const updatedBlog = await blog.save();
        res.status(201).json(updatedBlog);
    } catch (error) {
        res.status(402).send({ message: 'blog not found with this id ::' + req.params.id })
    }
})

router.get('/blogs/:id',async(req,res)=>{
	try {
		const blog = await Blog.findById(req.params.id);
		res.status(200).json({blog})
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})


router.get('/blogs', async (req, res) => {
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

router.get('/blogs/:pageIndex/:pageSize/:published', async (req, res) => {
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



module.exports = router;