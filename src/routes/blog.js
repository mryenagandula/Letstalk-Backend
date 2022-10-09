const express = require('express');
const requireAuth = require('../middlewares/requireauth.js');
const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');
const Tag = mongoose.model('Tags');
const Category = mongoose.model('Category');
const Comment = mongoose.model('Comment');
const Notifications = mongoose.model('Notifications');
const router = express.Router();

router.use(requireAuth)

router.get('/blogs/userId/:pageIndex/:pageSize/:published', async (req, res) => {
    try {
        const {pageIndex,pageSize,published}= req.params;
		const allBlogs = await Blog.find({userId:req.user._id,published});
		const blogs = await Blog.find({userId:req.user._id,published})
        .limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex))
        .populate('comments').populate('categories');
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
        const blogs = await Blog.find({userId:req.user._id}).populate('comments').populate('categories');
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
        if(tags.length> 0){
            tags.forEach(async(tagId) => {
                const tag = await Tag.findById(tagId);
                tag.blogs = [...tag.blogs, blog._id];
                await tag.save();
            });
        }
        if(categories.length> 0){
            categories.forEach(async(categoryId) => {
                const category = await Category.findById(categoryId);
                category.blogs = [...category.blogs, blog._id];
                await category.save();
            });
        }

        
        const notification = new Notifications({
            title: "PUBLISHED BLOG",
            description: `blog ${blog.title} is published successfully ${req.user.firstName} ${req.user.secondName}`,
            refType: "Blog",
            refId : blog._id,
            userId:req.user._id
        })
        await notification.save();
    
        res.status(201).send(blog);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.put('/blogs/:id' ,async (req, res) => {
    const { description,title,featureImageUri } = req.body;
    try {
        const blog = await Blog.findById(req.params.id);
        if(String(blog.userId) === String(req.user._id)) {
            blog.title = title;
            blog.description = description;
            blog.featureImageUri = featureImageUri;
            const updatedBlog = await blog.save();
            const notification = new Notifications({
                title: "BLOG UPDATION",
                description: `blog ${updatedBlog.title} is updated successfully ${req.user.firstName} ${req.user.secondName}`,
                refType: "Blog",
                refId : updatedBlog._id,
                userId:req.user._id
            })
            await notification.save();
            res.status(201).json(updatedBlog);
        }
        else{
            throw new Error(`Same user only allows to modify the blog`);
        }
    } catch (error) {
        res.status(402).send({ message: 'blog not found with this id ::' + req.params.id })
    }
})

router.get('/blogs/:id',async(req,res)=>{
	try {
		const blog = await Blog.findById(req.params.id)
        .populate('comments')
        .populate('categories')
        .populate('tags')
        .populate('userId',{password:0,roles:0,hobbies:0,dob:0,email_Verified:0,activated:0,createdAt:0,updatedAt:0,mobile: 0});
		res.status(200).json({blog})
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})


router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find()
        .populate('comments')
        .populate('categories')
        .populate('tags')
        .populate('userId',{password:0,roles:0,hobbies:0,dob:0,email_Verified:0,activated:0,createdAt:0,updatedAt:0,mobile: 0});

        res.status(201).send({blogs,totalCount:blogs.length})
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
		const blogs = await Blog.find({published})
        .limit(parseInt(pageSize))
        .skip(parseInt(pageSize)*parseInt(pageIndex))
        .populate('comments')
        .populate('categories')
        .populate('tags')
        .populate('userId',{password:0,roles:0,hobbies:0,dob:0,email_Verified:0,activated:0,createdAt:0,updatedAt:0,mobile: 0,middleName:0});
        res.status(201).send({blogs,totalCount:allBlogs.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/blogs/:pageIndex/:pageSize', async (req, res) => {
    try {
        const {pageIndex,pageSize}= req.params;
		const allBlogs = await Blog.find({});
		const blogs = await Blog.find({})
        .limit(parseInt(pageSize))
        .skip(parseInt(pageSize)*parseInt(pageIndex))
        .populate('comments')
        .populate('categories')
        .populate('tags')
        .populate('userId',{password:0,roles:0,hobbies:0,dob:0,email_Verified:0,activated:0,createdAt:0,updatedAt:0,mobile: 0});
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