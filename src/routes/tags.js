const express = require('express');
const requireAuth = require('../middlewares/requireauth.js');
const mongoose = require('mongoose');
const Tag = mongoose.model('Tags');

const router = express.Router();

router.use(requireAuth)

router.get('/tags/userId/:pageIndex/:pageSize', async (req, res) => {
    try {
        const {pageIndex,pageSize}= req.params;
		const allTags = await Tag.find({userId:req.user._id});
		const tags = await Tag.find({userId:req.user._id}).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
        res.status(201).send({tags,totalCount:allTags.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/tags/userId', async (req, res) => {
    try {
        const tags = await Tag.find({userId:req.user._id});
        res.status(201).send({tags,totalCount:tags.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.post('/tags' , async (req, res) => {
    const { title,description } = req.body;
    try {
        const tags = await Tag.find({title});
        if(tags.length === 0){
            const tag = new Tag({
                title,description,userId:req.user._id
            })
            try {
                await tag.save();
                res.status(201).send(tag);
            } catch (error) {
                res.status(500).send({ message: error.message });
            }
        }
        else{
            res.status(400).send({ message: `Tag ${title} is already exits` });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.put('/tags/:id' ,async (req, res) => {
    const { description,title } = req.body;
    try {
        const tag = await Tag.findById(req.params.id);
        tag.title = title;
        tag.description = description;
        const updatedTag = await tag.save();
        res.status(201).json(updatedTag);
    } catch (error) {
        res.status(402).send({ message: 'Tag is not found with this id ::' + req.params.id })
    }
})

router.get('/tags/:id',async(req,res)=>{
	try {
		const tag = await Tag.findById(req.params.id);
		res.status(200).json({tag})
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})


router.get('/tags', async (req, res) => {
    try {
        const tags = await Tag.find();
        res.status(201).send({tags,totalCount:tags.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/tags/:pageIndex/:pageSize', async (req, res) => {
    try {
        const {pageIndex,pageSize}= req.params;
		const allTags = await Tag.find({published});
		const tags = await Tag.find({published}).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
        res.status(201).send({tags,totalCount:allTags.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})



module.exports = router;