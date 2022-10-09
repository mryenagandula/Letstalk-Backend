const express = require('express');
const requireAuth = require('../middlewares/requireauth.js');
const mongoose = require('mongoose');
const Category = mongoose.model('Category');

const router = express.Router();

router.use(requireAuth)

router.get('/categories/userId/:pageIndex/:pageSize', async (req, res) => {
    try {
        const {pageIndex,pageSize}= req.params;
		const allCategories = await Category.find({userId:req.user._id});
		const categories = await Category.find({userId:req.user._id}).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
        res.status(201).send({categories,totalCount:allCategories.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/categories/userId', async (req, res) => {
    try {
        const categories = await Category.find({userId:req.user._id});
        res.status(201).send({categories,totalCount:categories.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.post('/categories' , async (req, res) => {
    const { title,description } = req.body;
    try {
        const categories = await Category.find({title});
        if(categories.length === 0){
            const category = new Category({
                title,description,userId:req.user._id
            })
            try {
                await category.save();
                res.status(201).send(category);
            } catch (error) {
                res.status(500).send({ message: error.message });
            }
        }
        else{
            res.status(400).send({ message: `Category ${title} is already exits` });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.put('/categories/:id' ,async (req, res) => {
    const { description,title } = req.body;
    try {
        if(String(category.userId) === String(req.user._id)) {
            const category = await Category.findById(req.params.id);
            category.title = title;
            category.description = description;
            const updatedCategory = await category.save();
            res.status(201).json(updatedCategory);
        }
        else{
            throw new Error(`Same user only allows to modify the category`);
        }
    } catch (error) {
        res.status(402).send({ message: 'Category is not found with this id ::' + req.params.id })
    }
})

router.get('/categories/:id',async(req,res)=>{
	try {
		const category = await Category.findById(req.params.id);
		res.status(200).json({category})
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})


router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(201).send({categories,totalCount:categories.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/categories/:pageIndex/:pageSize', async (req, res) => {
    try {
        const {pageIndex,pageSize}= req.params;
		const allCategories = await Category.find({});
		const categories = await Category.find({}).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
        res.status(201).send({categories,totalCount:allCategories.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})



module.exports = router;